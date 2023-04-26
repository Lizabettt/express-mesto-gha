const Card = require('../models/cards');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res.status(500).send({ message: 'Что-то на серверной стороне' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error('Не найден');
    })
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.message === 'Не найден') {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
      }
    });
};

const onLikedCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Передан несуществующий _id карточки.');
    })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message === 'Передан несуществующий _id карточки.') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
      }
    });
};

const offLikedCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Передан несуществующий _id карточки.');
    })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message === 'Передан несуществующий _id карточки.') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(500).send({ message: 'Что-то на серверной стороне' });
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
