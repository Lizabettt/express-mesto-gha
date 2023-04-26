
const express = require("express");
//создаем сервер
const app = express();
//если порт прописанный в json не доступенб используй 3005 порт
const { PORT = 3005} = process.env;
const mongoose = require("mongoose");
//const bodyParser = require('body-parser');
const router = require('./routes');

app.use(express.json())

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
.then(() => { console.log('MONGO START')})
.catch(() => { console.log('MONGO ERROR')});

// установим себе id
app.use((req, res, next) => {
  req.user = {
    _id: '6448c9ddb58c7aa9c992a868'
  };
  next();
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};
app.use(router);

//слушаем и показываем на каком порту запустился сервер
app.listen(PORT, () => {
  console.log(`SERVER START ON PORT =>> ${PORT}`);
});