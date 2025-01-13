To install `jq`, follow the instructions for your operating system:

### On Ubuntu/Debian

Run the following command:

```bash
sudo apt update
sudo apt install jq
```

### On macOS

If you use **Homebrew**, run:

```bash
brew install jq
```

### On Windows

1. Download the binary from the official [jq website](https://stedolan.github.io/jq/download/).
2. Add it to your system's PATH to use it from the command line.

Once installed, you can use `jq` to format and process JSON data. For example:

```bash
curl ... | jq '.' > output.json
```
