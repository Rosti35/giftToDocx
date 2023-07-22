const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function convertFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err); // Log error
        reject('Error reading file');
        return;
      }

      let giftContent = data
        .replace(/{/g, "")
        .replace(/}/g, "")
        .replace(/~/g, "")
        .replace(/=/g, "")
        .split("\n");

      let questionNumber = 1;
      let question = "";
      let answers = [];
      let table = [];

      giftContent.forEach((line, index) => {
        try {
          line = line.trim();
          if (line.startsWith("::")) {
            question = line.split("::")[2].split("[html]<p>")[1].split("</p>")[0];
          } else if (line.startsWith("<p>")) {
            answers.push(line.replace("<p>", "").replace("</p>", ""));
          } else if (line === "") {
            if (answers.length > 0) {
              table.push({ '№': questionNumber, 'Question': question, 'Answers': answers.join(", ") });
              questionNumber++;
              question = "";
              answers = [];
            }
          }
        } catch (error) {
          console.error(`Error processing line ${index + 1}: ${line}`, error);
        }
      });

      const dirPath = path.join(__dirname);
      const templatePath = path.join(dirPath, 'template', 'template.docx');
      const outputPath = path.join(dirPath, 'public', `${file.filename}.docx`);

      // Create the directory if it does not exist
      fs.mkdirSync(path.join(dirPath, 'public'), { recursive: true });

      // Load the docx file as a binary
      const content = fs.readFileSync(templatePath, 'binary');

      const zip = new PizZip(content);

      const doc = new Docxtemplater();
      doc.loadZip(zip);

      // set the templateVariables
      doc.setData({ table: table });

      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        console.error('Error generating docx:', error); // Log error
        reject('Error generating docx');
      }

      const buf = doc.getZip()
        .generate({ type: 'nodebuffer' });

      // write the generated docx to a file
      fs.writeFileSync(outputPath, buf);

      console.log('Finished writing docx file:', outputPath); // Log

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Failed to delete original file:', err); // Log error
        } else {
          console.log('Deleted original file:', file.path); // Log success
        }
      });

      resolve(`${file.filename}.docx`);
    });
  });
}

module.exports = convertFile;
