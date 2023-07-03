const fs = require('fs');
const express = require('express');
const multer  = require('multer');
const officegen = require('officegen');
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}`);
  }
});
const upload = multer({ storage: storage });

const app = express();

app.post('/upload', upload.single('giftFile'), (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Read the file
  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    // Perform transformations
    let giftContent = data;
    giftContent = giftContent.replace(/{/g, "").replace(/}/g, "").replace(/~/g, "WRONG: ").replace(/=/g, "ANSWER: ");
    giftContent = giftContent.replace(/%(.*)%/g, "(points: $1) ");

    let docx = officegen('docx');
    docx.on('error', function(err) {
      console.log(err);
    });
  
    let pObj = docx.createP();
    // Split content into lines
    let lines = giftContent.split("\n");
    for (let line of lines) {
      // Check if line is a comment
      if (line.trim().startsWith('//')) {
        pObj.addText(line, {italic: true}); // Add comment in italic
      } else {
        // Split line into normal text and comment
        let parts = line.split('#');
        pObj.addText(parts[0]);
        if (parts.length > 1) {
          pObj.addText(' #' + parts[1], {color: '888888'}); // Add comment in grey color
        }
      }
      pObj.addLineBreak();
    }
  
 
    let out = fs.createWriteStream(`./uploads/${req.file.filename}.docx`);
    out.on('error', function(err) {
      console.log(err);
    });
  
    docx.generate(out);
  
    out.on('finish', function() {
      // Delete the original GIFT file
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log('Failed to delete original file:', err);
        } else {
          console.log('Deleted original file');
        }
      });

      // Respond with the location of the docx file
      res.send({ fileLocation: `${req.file.path}.docx` });
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000'));
