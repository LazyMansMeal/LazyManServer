require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { UserDao } = require('./db');
const PORT = 8888;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log("server hit");
  res.send('Welcome Lazy Men!');
});

app.get('/users', async (req, res) => {
  let userDao = new UserDao();
  await userDao.connect();

  let users = await userDao.listUsers();
  await userDao.close();

  res.status(200).send(users);
})

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
  let { username, password } = req.body;

  let userDao = new UserDao();
  await userDao.connect();

  let auth = await userDao.login(username, password);
  await userDao.close();

  res.status(200).send(auth);
})

app.get('/recipes', authenticateToken, (req, res) => {
  res.sendFile('./recipes.json');
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

app.listen(PORT, () => {
  console.log(`Lazy Man Server listening on port ${PORT}`);
  console.log(process.env.LAZYMAN_ENV);  
});

