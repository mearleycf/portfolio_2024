import browserslist from "browserslist";
import fs from "node:fs/promises";

const supportedBrowsers = browserslist();

export const mapBrowsersToEsbuilldTargets = (browsers) => {
  return browsers
    .map((browser) => {
      const [browserName, browserVersion] = browser.split(" ");
      const [majorVersion, minorVersion] = browserVersion.split(".");
      const version = majorVersion + (minorVersion || "");
      switch (true) {
        case browserName.startsWith("chrome"):
          return `chrome${version}`;
        case browserName.startsWith(`firefox`):
          return `firefox${version}`;
        case browserName.startsWith(`safari`):
          return `safari${version}`;
        default:
          return null;
      }
    })
    .filter(Boolean);
};

/**
 * commenting out the code below as it is not needed for the current project
 
 */

const esbuildTargets = mapBrowsersToEsbuilldTargets(supportedBrowsers);

async function writeTargetsToFile(targets) {
  try {
    const data = JSON.stringify(targets, null, 2);
    await fs.writeFile("esbuild-targets.json", data);
    console.log("esbuild targets written to esbuild-targets.json");
  } catch (error) {
    console.error("Error writing esbuild targets to file", error);
  }
}

writeTargetsToFile(esbuildTargets).catch((e) => {
  console.error(e);
  process.exit(1);
});
