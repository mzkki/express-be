const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes');

// initial express
const app = express()

// app conf
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// server port
const port = 3000;

// route
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api', router);

// starting server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})