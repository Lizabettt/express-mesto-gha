const express = require('express');

const app = express();
const { PORT = 3005 } = process.env;
const mongoose = require('mongoose');
const router = require('./routes');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6448c9ddb58c7aa9c992a868',
  };
  next();
});

app.use(router);

app.listen(PORT);
