const fs = require("fs");
const path = require("path");

function getDirectoryStructure(dirPath, excludeFolders = []) {
  const stats = fs.statSync(dirPath);
  const item = {
    type: stats.isDirectory() ? "directory" : "file",
    name: path.basename(dirPath),
  };

  // If it's a directory, process its contents
  if (stats.isDirectory()) {
    const contents = fs.readdirSync(dirPath);

    // Filter out the directories to exclude
    const filteredContents = contents.filter(
      (child) => !excludeFolders.includes(child)
    );

    // Recursively get structure for the filtered contents
    item.contents = filteredContents.map((child) =>
      getDirectoryStructure(path.join(dirPath, child), excludeFolders)
    );
  }

  return item;
}

const targetDir = ".";
const excludeFolders = ["node_modules", "dist", ".vercel", ".git"]; // Folders to exclude from the structure
const structure = getDirectoryStructure(targetDir, excludeFolders);

// Save the structure to a JSON file
fs.writeFileSync(
  "./testing/structure.json",
  JSON.stringify(structure, null, 2),
  "utf-8"
);

console.log("Directory structure saved to testing/structure.json");
