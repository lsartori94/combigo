const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOU';

const ROLES = require('./constants');
const users = require('./store').users;

// Get all users
router.get('/', (req, res) => {
  let actualRole;
  let result;

  //switch horrendo
  if (req.query) {
    const {role} = req.query;
    switch(role) {
      case 'driver':
        actualRole = 1;
        break;
      case 'client':
        actualRole = 2;
        break;
      default:
        actualRole = 0;
    }
  };

  if (actualRole) {
    result = users.filter(user => user.role === actualRole);
  } else {
    result = users;
  }

  res.json(result);
});

/** Implementacion de Luca
router.get('/', (req, res) => {

    const {role} = req.query;
    const actualRole = ROLES[role.toUpperCase];
    let result;
  
    if (actualRole) {
      result = users.filter(user => user.role === actualRole);
    } else {
      result = users;
    }
  
    res.json(result);
});
*/

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

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  //check if username/email already exists
  const usernameExists = users.find(user => user.username === username);
  const emailExists = users.find(user => user.email === email);

  if (usernameExists) {
    return res.status(409).send(`Username already exists`);
  }
  if (emailExists) {
    return res.status(409).send(`Email already exists`);
  }

  users.push({
    username,
    email,
    password,
    name,
    bdate,
    role,
  });

  users = newUser;

  res.send(users);
});

// Modify user with username
router.put('/:uname', (req, res) => {
  const {uname} = req.params;
  const {username, email, password, name, role} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`User does not exists`);
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

module.exports = router;