const userRouter = require("express").Router();

const {
  createUser,
  getUsers,
  getUserId,
  getUserMy,
  changeUserData,
  changeAvatar,
} = require("../controllers/users");

//создаёт пользователя
userRouter.post('/', createUser);

//возвращает всех пользователей
userRouter.get("/", getUsers);
//возвращает пользователя по _id
userRouter.get("/:userId", getUserId);
//возвращает моего пользователя
userRouter.get("/me", getUserMy);

//обновяет профиль
userRouter.patch("/me", changeUserData);
//обновляет аватар
userRouter.patch("/me/avatar", changeAvatar);

module.exports = userRouter;
