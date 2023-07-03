const express = require('express');
const Convertator = require('./convertator');

const app = express();

app.post('/upload', Convertator.uploadMiddleware(), Convertator.convert);

app.listen(3000, () => console.log('Listening on port 3000'));

