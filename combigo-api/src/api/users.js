const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOU';

const CONSTANTS = require('./constants');
const users = require('./store').users;

// Get all users by role
router.get('/', (req, res) => {
    const {role} = req.query;
    const actualRole = CONSTANTS.ROLES[role.toUpperCase()];
    let result;

    if (actualRole) {
      result = users.filter(user => user.role === actualRole);
    } else {
      result = users;
    }
  
    res.json(result);
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
  const {username, email, password, name, bdate, role} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  // check if username/email already exists
  const usernameExists = users.find(user => user.username === username);
  const emailExists = users.find(user => user.email === email);

  if (usernameExists) {
    return res.status(409).send(`El nombre de usuario ya existe`);
  }
  if (emailExists) {
    return res.status(409).send(`El email ya existe`);
  }

  users.push({
    id: `${ID_BASE}${users.length + 1}`,
    username,
    email,
    password,
    name,
    bdate,
    role,
  });

  res.send(users);
});

// Modify user with username
router.put('/:uname', (req, res) => {
  const {uname} = req.params;
  const {username, email, password, name, bdate, role} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`User does not exists`);
  }

  // check if email already exists 
  const emailExists = users.find(user => (user.email === email) && (user.username != uname));

  if (emailExists) {
    return res.status(409).send(`El email ya existe`);
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
    return res.status(404).send(`User not found`);
  }

  users.splice(index, 1);

  res.json(users);
});

// Login user
router.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const result = users.find(user => user.email === email);

  if (!result) {
    res.status(404).send(`User not found`);
  }

  if (result.password !== password) {
    return res.status(401).send(`Not Authorized`)
  }

  res.json(result);
});

module.exports = router;
