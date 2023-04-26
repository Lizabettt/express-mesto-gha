const cardRouter = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  onLikedCard,
  offLikedCard
} = require('../controllers/cards');

//возвращает все карточки
cardRouter.get('/', getCards);
//создаёт карточку
cardRouter.post('/', createCard);
//удаляет карточку по идентификатору
cardRouter.delete('/:cardId', deleteCard);
//ставит лайк
cardRouter.put('/:cardId/likes', onLikedCard);
//удаляет лайк
cardRouter.delete('/:cardId/likes', offLikedCard);

module.exports = cardRouter;