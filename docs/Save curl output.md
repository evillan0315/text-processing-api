To save the output of the `curl` command, you can redirect the output to a file using the `>` operator in the command line. Here's an example:

```bash
curl --location 'https://api.cloudinary.com/v1_1/dt3mokrx9/resources/image' \
--header 'Authorization: Basic NDY5MTk5MzE0OTYzMjY0Om0yRGJBc1lUQnN2dktYeGRTQUlyNnd0Nkk1cw==' \
--header 'Cookie: _cld_session_key=2cd1ddff0cab1ed553bc42cba4d8ac82' > output.json
```

This will save the output to a file named `output.json` in the current directory.

### Additional Options

1. **Append to an existing file**:

   ```bash
   >> output.json
   ```

   This appends the output instead of overwriting the file.

2. **Save both output and error messages**:

   ```bash
   curl ... > output.json 2>&1
   ```

3. **Pretty-print the JSON output** (if it's JSON data):
   ```bash
   curl ... | jq '.' > output.json
   ```
   You'll need to have `jq` installed for this.
