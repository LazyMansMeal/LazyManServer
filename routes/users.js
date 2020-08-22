const express = require('express');
const router = express.Router();
const { UserDao } = require('../db');

router.post('/register', async (req, res) => {
  // extracting values explicitly creates implicit parameter validation
  let { username, password, fullName } = req.body;
  if (username.length === 0 || password.length === 0 || fullName.length === 0) {
    res.status(400).send({ message: "Please submit username, password, and fullName to register"});
    return;
  } 

  let userDao = new UserDao();
  await userDao.connect();

  let existing = await userDao.findUserByUsername(username);
  if (existing.length > 0) {
    res.status(400).send({ message: "Username is not available"});
    await userDao.close();
    return;
  }

  let auth = await userDao.registerUser(username, password, fullName);
  await userDao.close();
  
  res.status(200).send(auth);
})

router.post('/login', async (req, res) => {
  let { username, password } = req.body;

  let userDao = new UserDao();
  await userDao.connect();

  let auth = await userDao.login(username, password);
  await userDao.close();

  res.status(200).send(auth);
})

module.exports = router;