const express = require("express");
const validationUser = require("../middlewares/user.middleware");
const userService = require("../service/user.service");
const router = express.Router();

router.post("/login", async (req, res) => {
  const user = req.body;

  const userFound = await userService.getUsersByEmail(user);
  if (!userFound) {
    // TODO
    return res.render("loginFail", { email: user.username });
    //return res.status(404).json({ message: "Usuário não encontrado" });
  }

   /* else if(userFound ==="adminCoder@coder.com" && userFound.password === user.password) {
    return res.render("loginCoder")
  } */

  if (userFound.role === "admin" || userFound.role === "coder"  && userFound.password === user.password) {
    req.session.user = user;
    req.session.admin = true;
    req.session.coder = true;
    req.session.logged = true;
  } else {
    req.session.user = user;
    req.session.admin = false;
    req.session.logged = true;
  }
  console.log( { name: user.username });
  res.render("index", { name: user.username });
});

router.post("/", validationUser, async (req, res) => {
  const user = req.body;
  const userCreated = await userService.createUser(user);
  res.render("userCreated", { name: userCreated.first_name });
});

router.delete("/:email", async (req, res) => {
  const { email } = req.params;
  const user = await userService.deleteUser(email);
  res.render("userDeletado", { email });
});

router.put("/:uid", validationUser, async (req, res) => {
  try {
    const user = req.body;
    const { uid } = req.params;

    const newUser = await userService.updateUser(user, uid);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
