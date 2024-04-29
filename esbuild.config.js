import esbuild from "esbuild";
import fs from "node:fs";
import { open } from "node:fs/promises";
import path, { join } from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";
import { fileURLToPath } from "node:url";
import browserslist from "browserslist";
import { mapBrowsersToEsbuilldTargets } from "./browserslist.js";
import pkg from "esbuild-plugin-markdown";
import copyPlugin from "esbuild-plugin-copy";

const { markdownPlugin } = pkg;

/**
 * List of supported browsers based on the user's browserslist configuration.
 * @type {Array<string>}
 */
const supportedBrowsers = browserslist();
const esbuildTargets = await mapBrowsersToEsbuilldTargets(supportedBrowsers);

/**
 * Object that maps file extensions to loader options.
 * @type {Object.<string, string>}
 */
const loaderOpts = {
  ".css": "empty",
  ".js": "js",
  ".ts": "ts",
  ".tsx": "tsx",
  ".json": "json",
  ".svg": "dataurl",
  ".png": "dataurl",
  ".jpg": "dataurl",
  ".jpeg": "dataurl",
  ".gif": "dataurl",
  ".webp": "dataurl",
  ".woff": "dataurl",
  ".woff2": "dataurl",
  ".eot": "dataurl",
  ".ttf": "dataurl",
  ".otf": "dataurl",
  ".txt": "text",
  ".md": "text",
  ".html": "text",
};

/**
 * The fully resolved file path of the current module, derived from the URL of the module.
 * This is similar to `__filename` in CommonJS modules, providing the absolute path to the current module file.
 * It is obtained by converting the URL format of `import.meta.url` to a traditional file path format.
 *
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * The directory name of the current module, similar to `__dirname` in CommonJS.
 * This value represents the directory containing the current module, derived by parsing the `__filename`.
 * It is used to resolve relative file paths within the module, ensuring file operations are relative to the module's location rather than the working directory of the process.
 *
 * @type {string}
 */
const __dirname = path.dirname(__filename);

/**
 * Asynchronously processes a CSS file using PostCSS along with TailwindCSS. This function reads a CSS file,
 * applies TailwindCSS transformations, and then writes the processed CSS back to the filesystem.
 * The operation leverages Promises to handle asynchronous file read and write operations effectively.
 *
 * @returns {Promise<void>} A promise that resolves when the CSS processing is complete with no return value.
 */
const INPUT_CSS_FILE = join(__dirname, "src", "index.css"); // Input path for the CSS file to process
const OUTPUT_CSS_FILE = join(__dirname, "dist", "index.css"); // Output path where the processed CSS will be saved

// Create a PostCSS instance configured to use TailwindCSS with the provided configuration.
const postcssInstance = postcss().use(tailwindcss(tailwindConfig));

async function processCss() {
  const f = await open(INPUT_CSS_FILE, "r"); // Open the input CSS file for reading
  const buf = await f.readFile(); // Read the entire content of the CSS file into memory
  const result = await postcssInstance.process(buf, {
    from: INPUT_CSS_FILE, // Specify the source file path for PostCSS
    to: OUTPUT_CSS_FILE, // Specify the destination file path for PostCSS
  });
  await fs.promises.writeFile(OUTPUT_CSS_FILE, result.css); // Write the processed CSS to the output file
  await f.close(); // Close the file handle to free up system resources
}

// Execute the processCss function and handle any potential errors.
processCss().catch((e) => {
  console.error("Error processing CSS:", e); // Provide a clearer error message on failure
  process.exit(1); // Exit the process with a status code indicating failure
});

let ctx = await esbuild.context({
  entryPoints: ["src/index.tsx"],
  loader: loaderOpts,
  bundle: process.env.NODE_ENV === "production",
  treeShaking: process.env.NODE_ENV === "production",
  ignoreAnnotations: true,
  outbase: "src",
  outdir: "dist",
  minify: process.env.NODE_ENV === "production",
  format: "esm",
  splitting: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV === "production",
  jsx: "automatic",
  jsxDev: process.env.NODE_ENV === "development",
  target: esbuildTargets,
  define: { "process.env.NODE_ENV": `"${process.env.NODE_ENV}"` },
  plugins: [
    markdownPlugin(),
    copyPlugin({
      assets: {
        from: ["./src/index.html"],
        to: ["."],
      },
    }),
  ],
  color: true,
  write: false,
  metafile: true,
  banner: {
    js: `(() => new EventSource("/esbuild").onmessage = () => location.reload())();`,
  },
});

await ctx.watch();

let { host, port } = await ctx.serve({
  servedir: "dist",
});

console.log(`Serving on http://${host}:${port}`);
