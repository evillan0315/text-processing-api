# Text Processing API with Themes

## Overview
This is a Node.js-based REST API for processing and analyzing text. The API uses libraries like `natural` and `compromise` to extract keywords and identify themes from input text. It also provides basic natural language processing (NLP) functionalities such as tokenization and part-of-speech identification.

## Features
- Tokenizes input text into individual words.
- Filters out common stop words.
- Identifies and counts theme-related keywords based on a predefined set of themes.
- Highlights parts of speech (nouns and pronouns) in the processed text.
- Returns a JSON response with:
  - Processed text with wrapped keywords.
  - A list of extracted keywords and their associated themes.

## Prerequisites
Before running this project, ensure the following are installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Ensure the `themes.json` file exists in the project root directory. This file should define the themes and their related keywords, e.g.:
   ```json
   {
     "technology": ["computer", "AI", "software"],
     "sports": ["football", "basketball", "tennis"]
   }
   ```

## Usage

### Start the Server
Run the following command to start the server:

```bash
node index.js
```

The server will start on `http://localhost:3000` by default.

### API Endpoint
**POST** `/process-text`

#### Request Body
The request body should be in JSON format:

```json
{
  "text": "Your input text here"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/process-text \
-H "Content-Type: application/json" \
-d '{"text": "Artificial intelligence is transforming technology and sports alike."}'
```

#### Example Response
```json
{
  "wrapped_text": "<span>Artificial</span> intelligence is transforming <span>technology</span> and <span>sports</span> alike.",
  "keywords": [
    {
      "word": "technology",
      "theme": "technology",
      "count": 1
    },
    {
      "word": "sports",
      "theme": "sports",
      "count": 1
    }
  ]
}
```

## Key Libraries Used
- [express](https://expressjs.com/): Web framework for building the API.
- [natural](https://github.com/NaturalNode/natural): NLP library for tokenization and similarity measurements.
- [compromise](https://compromise.cool/): Lightweight NLP library for part-of-speech tagging.
- [cors](https://www.npmjs.com/package/cors): Middleware to enable Cross-Origin Resource Sharing (CORS).

## Customization
- **Themes:** Update the `themes.json` file to add or modify themes and their associated keywords.
- **Stop Words:** Customize the stop words list in the `extractHeavyKeywords` function.

## Error Handling
- If the `themes.json` file is missing or has syntax errors, the server will log the error and exit.
- The API responds with appropriate status codes and error messages for invalid requests.

## Acknowledgments
Special thanks to ChatGPT for providing assistance and valuable suggestions throughout the development of this project.

## License
This project is licensed under the MIT License.

