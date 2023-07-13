const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Delete a file or a list of files based on their paths
router.delete('/', (req, res) => {
  const { paths } = req.body; // Assuming the paths are provided in the request body as an array

  if (paths && Array.isArray(paths) && paths.length > 0) {
    // Delete specific files based on their paths
    const deletionPromises = paths.map(file => {
      return new Promise((resolve, reject) => {
        const sanitizedPath = path.normalize(file); // Sanitize the file path
        const fullPath = path.join(__dirname, 'public', sanitizedPath); // Assuming the files are located in the 'public' directory
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Error deleting file:', fullPath, err);
            reject(err);
          } else {
            console.log('File deleted successfully:', fullPath);
            resolve();
          }
        });
      });
    });

    Promise.all(deletionPromises)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error deleting files:', error);
        res.status(500).send('Failed to delete files');
      });
  } else {
    res.sendStatus(400);
  }
});

// Delete all files in the directory
router.delete('/all', (req, res) => {
  const directoryPath = path.join(__dirname, 'public'); // Specify the directory path
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', directoryPath, err);
      return res.status(500).send('Failed to read directory');
    }

    const deletionPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const fullPath = path.join(directoryPath, file);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Error deleting file:', fullPath, err);
            reject(err);
          } else {
            console.log('File deleted successfully:', fullPath);
            resolve();
          }
        });
      });
    });

    Promise.all(deletionPromises)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error deleting files:', error);
        res.status(500).send('Failed to delete files');
      });
  });
});

module.exports = router;
