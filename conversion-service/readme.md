# API Endpoints

## POST /upload

**Summary:**
Upload and convert GIFT files to .docx format.

**Request:**
Content-Type: multipart/form-data

Form-Data Key: `giftFiles`
Value: GIFT files in .gift format (up to 5 files)

**Response:**
Content-Type: application/json

```json
{
  "fileLocations": [
    "file1-1234567890.docx",
    "file2-1234567890.docx",
    //...
  ]
}
```

**Errors:**

- 400 Bad Request: No files uploaded.
- 500 Internal Server Error: Error during file reading or processing.

**Example:**

```bash
curl -X POST -H "Content-Type: multipart/form-data" -F "giftFiles=@file1.gift" -F "giftFiles=@file2.gift" http://localhost:3000/upload
```

This example uploads `file1.gift` and `file2.gift` to the server, converts them to .docx format, and returns the locations of the converted files in the response body.

---

## GET /download

**Summary:**
Download a file from the server.

**Request:**
Query Parameter:

- `path` (required): The path of the file to download.

**Response:**
The file will be downloaded.

**Errors:**

- 400 Bad Request: Invalid file path.
- 500 Internal Server Error: Failed to download file.

**Example:**

```bash
curl -X GET "http://localhost:3000/download?path=example.docx" --output example.docx
```

This example downloads the file `example.docx` from the server. The file will be saved with the same name in the current directory.

---

### DELETE /files

**Summary:**
Delete specific files based on their paths.

**Request:**
Content-Type: application/json

Body:

```json
{
  "paths": [
    "file1.docx",
    "file2.docx",
    //...
  ]
}
```

**Response:**
HTTP/1.1 200 OK

**Errors:**

- 400 Bad Request: No file paths provided.
- 500 Internal Server Error: Error during file deletion.

**Example:**

```bash
curl -X DELETE -H "Content-Type: application/json" -d '{"paths": ["/path/to/file1.docx", "/path/to/file2.docx"]}' http://localhost:3000/files
```

This example deletes the files specified in the `paths` array from the server.

---

### DELETE /files/all

**Summary:**
Delete all files in the specified directory.

**Request:**
No request parameters required.

**Response:**
HTTP/1.1 200 OK

**Errors:**
500 Internal Server Error: Error during file deletion.

**Example:**

```bash
curl -X DELETE http://localhost:3000/files/all
```

This example deletes all files in the specified directory.

---
