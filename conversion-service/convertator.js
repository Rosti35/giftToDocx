const fs = require('fs');
const multer  = require('multer');
const officegen = require('officegen');

// multer storage configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    console.log('File uploading:', file.originalname); // logging the uploading file
    cb(null, `${file.originalname}-${Date.now()}`);
  }
});
const upload = multer({ storage: storage });

class Convertator {
  // multer middleware for file uploading
  static uploadMiddleware() {
    console.log('Initialized upload middleware.'); // log
    return upload.array('giftFiles', 5); // you can change the maximum files here.
  }

  // conversion method
  static convert(req, res) {
    console.log('Start converting files.'); // log

    // checking if files are provided
    if (req.files && req.files.length > 0) {
      // creating promise for each file to manage async operations
      let filePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          // reading file content
          fs.readFile(file.path, 'utf8', (err, data) => {
            if (err) {
              console.log('Error reading file:', err); // log error
              reject('Error reading file');
              return;
            }

            // Perform transformations
            let giftContent = data;
            giftContent = giftContent.replace(/{/g, "").replace(/}/g, "").replace(/~/g, "WRONG: ").replace(/=/g, "ANSWER: ");
            giftContent = giftContent.replace(/%(.*)%/g, "(points: $1) ");

            let docx = officegen('docx');
            docx.on('error', function(err) {
              console.log('Error generating docx:', err); // log error
            });

            // create paragraph for each line in docx file
            let pObj = docx.createP();

            // split content into lines and process each line
            let lines = giftContent.split("\n");
            for (let line of lines) {
              // checking if line is a comment
              if (line.trim().startsWith('//')) {
                pObj.addText(line, {italic: true}); // add comment in italic
              } else {
                // split line into normal text and comment
                let parts = line.split('#');
                pObj.addText(parts[0]);
                if (parts.length > 1) {
                  pObj.addText(' #' + parts[1], {color: '888888'}); // add comment in grey color
                }
              }
              pObj.addLineBreak();
            }

            // prepare for writing the converted content into a new docx file
            let out = fs.createWriteStream(`./uploads/${file.filename}.docx`);
            out.on('error', function(err) {
              console.log('Error writing docx file:', err); // log error
            });

            // generate the docx file
            docx.generate(out);

            out.on('finish', function() {
              console.log('Finished writing docx file:', `./uploads/${file.filename}.docx`); // log

              // Delete the original GIFT file
              fs.unlink(file.path, (err) => {
                if (err) {
                  console.log('Failed to delete original file:', err); // log error
                } else {
                  console.log('Deleted original file:', file.path); // log success
                }
              });

              // resolve the promise with the location of the new docx file
              resolve(`./uploads/${file.filename}.docx`);
            });
          });
        });
      });

      // wait for all promises to resolve and then send the response
      Promise.all(filePromises)
        .then(fileLocations => {
          console.log('All files converted successfully.'); // log success
          res.send({ fileLocations });
        })
        .catch(error => {
          console.log('An error occurred during file conversion:', error); // log error
          res.status(500).send(error);
        });
    } else {
      console.log('No files uploaded.'); // log
      res.status(400).send('No files uploaded');
    }
  }
}

module.exports = Convertator;
