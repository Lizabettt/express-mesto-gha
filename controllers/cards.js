const Card = require('../models/cards');
const { NotFound, BadRequest, ServerError, Forbiden } = require('../errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NotFound)
          .send({ message: ' Карточка с указанным _id не найдена.' });
      } else {
        res.send({ card });
        const owner = card.owner.toString();
        if (req.user._id === owner) {
          Card.deleteOne(card)
            .then(() => {
              res.send({ card });
            });
        } else {
          throw new Forbiden('Чужие карточки удалить нельзя!');
        }
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные для удаления карточки.',
        });
      } else {
        res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
      }
    });
};

const onLikedCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(NotFound)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
      }
    });
};

const offLikedCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(NotFound)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else {
        res.status(ServerError).send({ message: 'Что-то на серверной стороне...' });
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
