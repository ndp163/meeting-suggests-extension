const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;
const router = require('./src/routes');
const bodyParser = require('body-parser');

// app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/', router);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});