const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOU';

const users = require('./store').users;

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Search for user with username
router.get('/:uname', (req, res) => {
  const {uname} = req.params;
  const result = users.find(user => user.username === uname);

  if (!result) {
    res.status(404).send(`User not found`);
  }

  res.json(result);
});

// Create user
router.post('/', (req, res) => {
  const {username, email, password, name, role} = req.body;

  //TODO check empty fields
  if (!req.body) {
    res.status(400).send(`Bad Request`)
  }

  //check if username already exists
  const exists = users.find(user => user.username === username);

  if (exists) {
    res.status(409).send(`User already exists`);
  }

  const newUser = [...users, {
    id: `${ID_BASE}${users.length + 1}`,
    username,
    email,
    password,
    name,
    bdate,
    role,
  }];

  users = newUser;

  res.send(users);
});

// Modify user with username
router.put('/:uname', (req, res) => {
  const {uname} = req.params;
  const {username, email, password, name, role} = req.body;

  if (!req.body) {
    res.status(400).send(`Bad Request`)
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    res.status(409).send(`User does not exists`);
  }

  users[exists] = {
    username,
    email,
    password,
    name,
    bdate,
    role,
  };

  res.send(users);
});

// Delete user with username
router.delete('/:uname', (req, res) => {
  const {uname} = req.params;
  const index = users.findIndex(user => user.username === uname);

  if (index === -1) {
    res.status(404).send(`User not found`);
  }

  users.splice(index, 1);

  res.json(users);
});

module.exports = router;