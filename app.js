
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3005} = process.env;//если порт прописанный в json не доступенб используй 3005 порт

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(express.json())

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb");

app.listen(PORT, () => {
  console.log(`SERVER START ON PORT: ${PORT}`);
});
//
