const fs = require('fs');
const path = require('path');
const officegen = require('officegen');

function convertFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, 'utf8', (err, data) => {
      if (err) {
        console.log('Error reading file:', err); // Log error
        reject('Error reading file');
        return;
      }

      // Perform transformations
      let giftContent = data;
      giftContent = giftContent.replace(/{/g, "").replace(/}/g, "").replace(/~/g, "WRONG: ").replace(/=/g, "ANSWER: ");
      giftContent = giftContent.replace(/%(.*)%/g, "(points: $1) ");

      const docx = officegen('docx');
      docx.on('error', function (err) {
        console.log('Error generating docx:', err); // Log error
      });

      const pObj = docx.createP();

      const lines = giftContent.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith('//')) {
          pObj.addText(line, { italic: true }); // Add comment in italic
        } else {
          const parts = line.split('#');
          pObj.addText(parts[0]);
          if (parts.length > 1) {
            pObj.addText(' #' + parts[1], { color: '888888' }); // Add comment in grey color
          }
        }
        pObj.addLineBreak();
      }
      const dirPath = path.join(__dirname, 'public');
      const outputPath = path.join(dirPath, `${file.filename}.docx`);
      
      // Create the directory if it does not exist
      fs.mkdirSync(dirPath, { recursive: true });
      
      const out = fs.createWriteStream(outputPath);
      out.on('error', function (err) {
        console.log('Error writing docx file:', err); // Log error
        reject('Error writing docx file');
      });
      
      docx.generate(out);

      out.on('finish', function () {
        console.log('Finished writing docx file:', outputPath); // Log

        fs.unlink(file.path, (err) => {
          if (err) {
            console.log('Failed to delete original file:', err); // Log error
          } else {
            console.log('Deleted original file:', file.path); // Log success
          }
        });

        resolve(`${file.filename}.docx`);
      });
    });
  });
}

module.exports = convertFile;
