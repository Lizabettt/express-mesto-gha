const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6448c9ddb58c7aa9c992a868',
  };
  next();
});
app.use('/', router);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT);
