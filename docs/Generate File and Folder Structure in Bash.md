To display the file and folder structure in JSON format using a Bash script, you can use the `tree` command with the `-J` option. Here's how:

### Step 1: Install `tree` (if not already installed)

If the `tree` command is not available on your system, you can install it:

- **Ubuntu/Debian:**

  ```bash
  sudo apt-get install tree
  ```

- **macOS (using Homebrew):**

  ```bash
  brew install tree
  ```

- **Fedora:**
  ```bash
  sudo dnf install tree
  ```

---

### Step 2: Use `tree` with `-J` to Output JSON

Navigate to the root directory of your project and run the following command:

```bash
tree -J
```

This will output the file and folder structure in JSON format.

---

### Step 3: Save the Output to a File (Optional)

To save the JSON output to a file:

```bash
tree -J > structure.json
```

You can then open `structure.json` to view the file and folder structure.

---

### Example Output

Here’s an example of what the output might look like:

```json
[
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
```

Let me know if you need further assistance!
