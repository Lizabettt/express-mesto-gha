const Card = require('../models/cards');
const { NotFound, BadRequest, Forbiden } = require('../errors');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании карточки.'),
        );
        return;
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
        return
      } else {
        const owner = card.owner.toString();
        if (req.user._id === owner) {
          return Card.deleteOne(card).then(() => {
            res.send({ card });
          });
        }
        next(new Forbiden('Чужие карточки удалить нельзя!'));
        return
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные для удаления карточки.'),
        );
        return;
      }
      next(err);
    });
};

const onLikedCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
        return
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные для постановки лайка'),
        );
        return;
      }
      next(err);
    });
};

const offLikedCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с указанным _id не найдена.'));
        return
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  onLikedCard,
  offLikedCard,
};
