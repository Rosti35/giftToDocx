const express = require('express');
const path = require('path');

const router = express.Router();

// Middleware for serving static files
router.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
  const filePath = req.query.path; // Assuming the path is provided as a query parameter

  if (!filePath) {
    return res.status(400).send('Invalid file path');
  }

  const fullPath = path.join(__dirname, 'public', filePath);
  res.download(fullPath, path.basename(fullPath), (err) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Failed to download file');
    }
  });
});

module.exports = router;

