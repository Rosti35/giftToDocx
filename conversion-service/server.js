const convertatorRouter = require('./convertator');
const express = require('express');
const downloadRouter = require('./download');
const filesRouter = require('./files');

const app = express();

// Route for file download
app.use('/download', downloadRouter);

// Route for deleting files
app.use('/files', filesRouter);

app.use('/upload', convertatorRouter);

app.listen(3000, () => console.log('Listening on port 3000'));




