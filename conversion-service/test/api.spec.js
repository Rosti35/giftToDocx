const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Assuming the code is in app.js
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const should = chai.should();

chai.use(chaiHttp);

describe('API Endpoint Tests', () => {

  let convertedFiles;

  describe('POST /upload', () => {
    it('should upload and convert GIFT files', (done) => {
      chai
        .request(server)
        .post('/upload')
        .attach('giftFiles', fs.readFileSync(path.join(__dirname, './testFiles/file1.gift')), 'file1.gift')
        .attach('giftFiles', fs.readFileSync(path.join(__dirname, './testFiles/file3.gift')), 'file3.gift')
        .end((err, res) => {
          console.log("status: ", res.status)
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('convertedFiles');
          expect(res.body.convertedFiles).to.be.an('array').that.is.not.empty;
          convertedFiles = res.body.convertedFiles;
          done();
        });
    });
  });

  describe('GET /download', () => {
    it('should download a file', (done) => {
      const filename = convertedFiles[0]; // Assuming the first file in the response is downloaded

      chai
        .request(server)
        .get('/download')
        .query({ path: filename })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-disposition', `attachment; filename="${filename}"`);
          // Add more assertions based on the expected response
          done();
        });
    });
  });

  describe('DELETE /files', () => {
    it('should delete specific files', (done) => {
      const filenames = convertedFiles; // Assuming all converted files are deleted

      chai
        .request(server)
        .delete('/files')
        .send({ paths: filenames })
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add more assertions based on the expected response
          done();
        });
    });
  });

});
