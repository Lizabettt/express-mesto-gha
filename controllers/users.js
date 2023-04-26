const User = require("../models/users");

//создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ newUser }))
    .catch((err) => {
      if (err.message == "ValidationError") {
        res.status(400).send({ message: "Ошибка заполнения поля" });
      } else {
        res.status(500).send({ message: "Что-то пошло не так..." });
      }
    });
};
//запрос всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      res.status(500).send({ message: "Что-то пошло не так..." });
    });
};
//запрос своего пользователя
const getUserMy = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      res.status(404).send({ message: "Пользователь потерян..." });
    });
};

//  запрос пользователя по _id
const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    //если метод findById не нашел запрашиваемую запись /id не найден/
    .orFail(() => {
      throw new Error("Не найден");
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      //если мы не нашел пользователя покажи 404 = "Не найден"
      if (err.message == "Не найден") {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};

//изменение данных пользователя
const changeUserData = (req, res) => {
  const { name, about } = req.body;
  console.log("req.body", req.body);
  User.findByIdAndUpdate( req.user._id, { name, about }, { new: true })
    .orFail(() => {
      throw new Error("Пользователь по указанному _id не найден");
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message == "Пользователь по указанному _id не найден") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при обновлении профиля" });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};
//изменение аватара
const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, { new: true })
  .orFail(() => {
    throw new Error("Пользователь по указанному _id не найден");
  })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message == "Пользователь по указанному _id не найден") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при обновлении аватара." });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};
module.exports = {
  createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
};
