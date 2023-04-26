const Card = require("../models/cards");

//создание новой карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.message == "ValidationError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные при создании карточки.",
          });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};

//запрос всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      res.status(500).send({ message: "Что-то на серверной стороне" });
    });
};

//удаление карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error("Не найден");
    })
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.message == "Не найден") {
        res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};

// установка лайка карточке
const onLikedCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("Передан несуществующий _id карточки.");
    })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message == "Передан несуществующий _id карточки.") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные для постановки лайка",
          });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};

// Снимаем лайк карточке
const offLikedCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("Передан несуществующий _id карточки.");
    })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message == "Передан несуществующий _id карточки.") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные для снятия лайка" });
      } else {
        res.status(500).send({ message: "Что-то на серверной стороне" });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  onLikedCard,
  offLikedCard,
};
