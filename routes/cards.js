const cardRouter = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  onLikedCard,
  offLikedCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', onLikedCard);
cardRouter.delete('/:cardId/likes', offLikedCard);

module.exports = cardRouter;
