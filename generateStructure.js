const fs = require('fs');
const path = require('path');

function getDirectoryStructure(dirPath) {
  const stats = fs.statSync(dirPath);
  const item = {
    type: stats.isDirectory() ? 'directory' : 'file',
    name: path.basename(dirPath),
  };

  if (stats.isDirectory()) {
    item.contents = fs.readdirSync(dirPath).map((child) =>
      getDirectoryStructure(path.join(dirPath, child))
    );
  }

  return item;
}

const targetDir = './data';                                                  
const structure = getDirectoryStructure(targetDir);

// Save the structure to a JSON file
fs.writeFileSync('structure.json', JSON.stringify(structure, null, 2), 'utf-8');

console.log('Directory structure saved to structure.json');
