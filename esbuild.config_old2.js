#!/usr/bin/env node

import * as esbuild from "esbuild";
import fs from "node:fs";
import browserslist from "browserslist";
import { mapBrowsersToEsbuilldTargets } from "./browserslist.js";
import copyfiles from "copyfiles";
import tailwindPlugin from "esbuild-plugin-tailwindcss";
import devServer from "esbuild-plugin-dev-server";

const supportedBrowsers = browserslist();

const esbuildTargets = await mapBrowsersToEsbuilldTargets(supportedBrowsers);

const loaderOpts = {
  ".css": "css",
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

async function copyHtml() {
  copyfiles(["src/index.html", "dist"], true, (err) => {
    if (err) {
      console.error("Failed to copy HTML file:", err);
      process.exit(1);
    } else {
      console.log("HTML file copied to dist");
    }
  });
}

async function buildProject() {
  try {
    const result = await esbuild.build({
      entryPoints: ["src/index.tsx"],
      bundle: true,
      minify: true,
      sourcemap: true,
      outdir: "dist",
      loader: { ...loaderOpts },
      ignoreAnnotations: true,
      target: esbuildTargets,
      format: "esm",
      metafile: true,
      outExtension: {
        ".js": ".js",
        ".css": ".css",
      },
      plugins: [tailwindPlugin()],
    });

    if (result && result.metafile) {
      console.log("Build Files:");
      Object.keys(result.metafile.outputs).forEach((outputFile) => {
        console.log(outputFile);
      });
    } else {
      console.error("Build failed: no metafile generated");
      process.exit(1);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
buildProject()
  .then(() => {
    copyHtml();
  })
  .catch((e) => {
    console.error("Build process failed:", e);
    process.exit(1);
  });
