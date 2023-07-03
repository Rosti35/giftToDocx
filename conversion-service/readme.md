# Convertator Class Documentation

## Introduction

The Convertator class serves as a converter for GIFT file formats into .docx format. It is built as a middleware and controller for Express.js, using the multer library for file handling, officegen for .docx file generation, and Node.js built-in fs module for file system operations.

## Class Methods

### `uploadMiddleware()`

This static method initializes and returns the multer middleware configured to handle multiple file uploads. Files are stored in the ./uploads/ directory, and filenames are preserved with a timestamp appended for uniqueness. The method currently allows up to 5 files to be uploaded at a time.

```javascript
static uploadMiddleware()
```

### `convert(req, res)`

This static method acts as an Express.js controller. It reads the uploaded GIFT files, converts them into .docx format, writes the .docx files to disk, deletes the original GIFT files, and finally sends a JSON response containing the file paths of the converted files. If no files were uploaded, a 400 response is sent. If an error occurs during processing, a 500 response is sent.

```javascript
static convert(req, res)
```

## Usage

To use this class, import it into your Express.js application, use the `uploadMiddleware()` method as middleware for your desired route, and `convert()` as the controller for that route.

```javascript
const express = require('express');
const Convertator = require('./Convertator');
const app = express();

app.post('/upload', Convertator.uploadMiddleware(), Convertator.convert);

app.listen(3000, () => console.log('Listening on port 3000'));
```

---

## API Endpoints

### POST /upload

**Summary:**
Upload and convert GIFT files to .docx format

**Request:**
Form-data key: `giftFiles`
Value: Files in .gift format (up to 5)

**Response:**
HTTP/1.1 200 OK
Content-Type: application/json
Body:

```json
{
  "fileLocations": [
    "./uploads/file1-1234567890.docx",
    "./uploads/file2-1234567890.docx",
    //...
  ]
}
```

**Errors:**

- If no files are uploaded, the server responds with a 400 status code and 'No files uploaded'.
- If an error occurs during file reading or processing, the server responds with a 500 status code and an error message.

**Example:**

```bash
curl -X POST -H "Content-Type: multipart/form-data" -F "giftFiles=@file1.gift" -F "giftFiles=@file2.gift" http://localhost:3000/upload
```

This will upload `file1.gift` and `file2.gift` to the server, convert them to .docx format, and return the locations of the converted files in the response body.
