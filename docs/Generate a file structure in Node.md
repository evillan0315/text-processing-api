Yes, you can generate a file and folder structure in JSON format using Node.js! Here's how you can achieve this:

---

### Step 1: Create a Script

Create a new file, for example, `generateStructure.js`, and add the following code:

```javascript
const fs = require("fs");
const path = require("path");

function getDirectoryStructure(dirPath) {
  const stats = fs.statSync(dirPath);
  const item = {
    type: stats.isDirectory() ? "directory" : "file",
    name: path.basename(dirPath),
  };

  if (stats.isDirectory()) {
    item.contents = fs
      .readdirSync(dirPath)
      .map((child) => getDirectoryStructure(path.join(dirPath, child)));
  }

  return item;
}

const targetDir = "."; // Change this to your target directory, e.g., './src'
const structure = getDirectoryStructure(targetDir);

// Save the structure to a JSON file
fs.writeFileSync("structure.json", JSON.stringify(structure, null, 2), "utf-8");

console.log("Directory structure saved to structure.json");
```

---

### Step 2: Run the Script

1. Open your terminal.
2. Run the script using Node.js:
   ```bash
   node generateStructure.js
   ```

This will generate a `structure.json` file in the same directory, containing the file and folder structure.

---

### Example Output

If your project has the following structure:

```
project/
  src/
    index.js
    utils/
      tokenizer.js
  server.js
```

The `structure.json` will look like:

```json
{
  "type": "directory",
  "name": "project",
  "contents": [
    {
      "type": "directory",
      "name": "src",
      "contents": [
        {
          "type": "file",
          "name": "index.js"
        },
        {
          "type": "directory",
          "name": "utils",
          "contents": [
            {
              "type": "file",
              "name": "tokenizer.js"
            }
          ]
        }
      ]
    },
    {
      "type": "file",
      "name": "server.js"
    }
  ]
}
```

---

### Step 3: Customize as Needed

You can modify the `targetDir` variable to specify the directory whose structure you want to export.

Let me know if you need further enhancements or explanations! 😊
