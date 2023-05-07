require('dotenv').config(); // env-переменные из файла .env добавятся в process.env ; .env вгит игнор добавить
// console.log(process.env.NODE_ENV); // production

const express = require('express');

const app = express();

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const rateLimit = require('express-rate-limit');
//  Чтобы защититься от множества автоматических запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);// подключаем rate-limiter

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { errors } = require('celebrate');
const { NotFound } = require('./errors');
const router = require('./routes');

app.use('/', router);
app.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;// если у ошибки нет статуса, выставляем 500
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Что-то на серверной стороне...'
        : message,
    });
  next();
});

app.listen(PORT);
