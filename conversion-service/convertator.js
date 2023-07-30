const express = require('express');
const convertFile = require('./convertF');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const router = express.Router();


// Multer storage configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    console.log('File uploading:', file.originalname); // Log the uploading file

    // create a hash instance
    let hash = crypto.createHash('sha256');

    // hashing the filename with current date as a salt
    const fileName = file.originalname + '-' + Date.now();
    hash.update(fileName);

    // Replace filename with hashed filename
    cb(null, hash.digest('hex').substring(0, 16));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.gift') { // Only accept .gift files
      return cb(new Error('Only .gift files are allowed.'), false);
    }
    cb(null, true);
  }
});

router.use(upload.array('giftFiles', 5)); // Use upload middleware with the maximum files limit

router.post('/', async (req, res) => {
  console.log('Start converting files.'); // Log

  try {
    // Checking if files are provided
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded.'); // Log
      return res.status(400).send('No files uploaded');
    }

    const filePromises = req.files.map(file => convertFile(file));

    const convertedFiles = await Promise.all(filePromises);
    console.log('All files converted successfully.'); // Log success
    return res.json({ convertedFiles });
  } catch (error) {
    console.error('An error occurred during file conversion:', error); // Log error
    return res.status(500).send('Failed to convert files');
  }
});

module.exports = router;
