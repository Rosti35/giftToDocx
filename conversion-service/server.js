
const convertatorRouter = require('./convertator');
const express = require('express');
const downloadRouter = require('./download');
const filesRouter = require('./files');

const app = express();
app.use(express.json());

// Route for file download
app.use('/download', downloadRouter);

// Route for deleting files
app.use('/files', filesRouter);

app.use('/upload', convertatorRouter);

const server = app.listen(3000, () => console.log('Server listening on port 3000'));

module.exports = server;

