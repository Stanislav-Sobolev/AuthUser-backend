const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Импорт библиотеки jsonwebtoken

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [];
const secretKey = 'your-secret-key'; // Замените на ваш секретный ключ

// Функция для создания JWT токена
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
};

app.post('/login', (req, res) => {
  const { usernameLogin, passwordLogin } = req.body;
  const findUser = users.find(el => el.username === usernameLogin && el.password === passwordLogin);
  if (findUser) {
    const token = generateToken(findUser);
    
    res.json({ token });
  } else {
    return res.status(400).json({ error: 'Username or password is incorrect' });
  }
});

app.post('/signup', (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'UserName, Name and Password are required' });
  }

  const findUser = users.find(el => el.username === username);
  if (findUser) {
    return res.status(400).json({ error: 'Username already in use' });
  }

  const newUser = { id: users.length + 1, username, name, password };
  users.push(newUser);

  const token = generateToken(newUser);
  res.status(201).json({ user: newUser, token });
});

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
