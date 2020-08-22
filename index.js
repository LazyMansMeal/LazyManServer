require('dotenv').config();

const express = require('express');
const app = express();
const recipes = require('./routes/recipes');
const users = require('./routes/users');
const PORT = 8888;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/recipes', recipes);
app.use('/users', users);

app.get('/', (req, res) => {
  console.log("server hit");
  res.send('Welcome Lazy Men!');
});

app.listen(PORT, () => {
  console.log(`Lazy Man Server listening on port ${PORT}`);
  console.log(process.env.LAZYMAN_ENV);  
});

