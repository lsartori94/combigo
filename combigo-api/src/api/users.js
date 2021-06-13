const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOU';

const CONSTANTS = require('./constants');
const users = require('./store').users;
const travels = require('./store').travels;

// Get all users by role
router.get('/', (req, res) => {
    const {role} = req.query;
    const actualRole = role && CONSTANTS.ROLES[role.toUpperCase()];
    let result;

    const activeUsers = users.filter(user => user.active === true );

    if (actualRole) {
      result = activeUsers.filter(user => user.role === actualRole);
    } else {
      result = activeUsers;
    }
  
    res.json(result);
});

// Search for user with username
router.get('/:uname', (req, res) => {
  const {uname} = req.params;
  const result = users.find(user => user.username === uname);

  if (!result) {
    res.status(404).send(`Usuario no encontrado`);
  }

  res.json(result);
});

// Search for user with id
router.get('/id/:id', (req, res) => {
  const {id} = req.params;
  const result = users.find(user => user.id === id);

  if (!result) {
    res.status(404).send(`Usuario no encontrado`);
  }

  res.json(result);
});

// Create user
router.post('/', (req, res) => {
  const {username, email, password, dni, name, bdate, role} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  // check if username/email already exists
  const usernameExists = users.find(user => user.username === username);
  const emailExists = users.find(user => user.email === email);
  const dniExists = users.find(user => user.dni === dni);

  if (usernameExists) {
    return res.status(409).send(`El Nombre de Usuario ya existe`);
  }
  if (emailExists) {
    return res.status(409).send(`El Email ya existe`);
  }
  if (dniExists) {
    return res.status(409).send(`El DNI ya existe`);
  }

  const newUser = {
    id: `${ID_BASE}${users.length + 1}`,
    username,
    email,
    password,
    name,
    bdate,
    dni,
    role,
    active: true,
  }

  users.push(newUser);

  res.send(newUser);
});

// Modify user with username
router.put('/:uname', (req, res) => {
  const {uname} = req.params;
  const {username, email, password, name, bdate, dni, role} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`Usuario no encontrado`);
  }

  if (users[exists].active === false ) {
    return res.status(405).send(`Usuario inactivo`);
  }

  // check if email/dni already exists 
  const emailExists = users.find(user => (user.email === email) && (user.username != uname));
  const dniExists = users.find(user => (user.dni === dni) && (user.username != uname));

  if (emailExists) {
    return res.status(409).send(`El email ya existe`);
  }

  if (dniExists) {
    return res.status(409).send(`El DNI ya existe`);
  }

  users[exists] = {
    username,
    email,
    password,
    name,
    bdate,
    dni,
    role,
    active: true,
  };

  res.send(users);
});

// Get user bookings
router.get('/:uname/bookings', (req, res) => {
  const {uname} = req.params;
  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`Usuario no encontrado`);
  }

  return res.send(users[exists].travelHistory);
});

// Get CC
router.get('/:uname/card', (req, res) => {
  const {uname} = req.params;
  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`Usuario no encontrado`);
  }

  const result = Object.assign(users[exists]);
  
  if (result.creditCard)
    return res.send(result.creditCard);
  else
    return res.send({});
});

// Create CC
router.put('/:uname/card', (req, res) => {
  const {uname} = req.params;
  const { issuer, number, cardHolder, expDate, cvv } = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`);
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`Usuario no encontrado`);
  }

  if (!number || !cardHolder || !cvv || !expDate) {
    return res.status(400).send(`Bad Request`);
  }

  if (number === '3333333333333333') { //tarjeta invalida
    return res.status(405).send(`La tarjeta es inválida.`);
  }

  users[exists].creditCard = {
    issuer,
    number,
    cardHolder,
    expDate,
    cvv
  };

  return res.send(users[exists].creditCard);
});

// Delete CC
router.delete('/:uname/card', (req, res) => {
  const {uname} = req.params;

  if (!req.body) {
    return res.status(400).send(`Bad Request`);
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`Usuario no encontrado`);
  }

  users[exists].creditCard = {};

  return res.send({});
});

// VIP
router.put('/:uname/vip', (req, res) => {
  const {uname} = req.params;
  const {vipStatus} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`);
  }

  const exists = users.findIndex(user => user.username === uname);

  if (exists === -1) {
    return res.status(409).send(`Usuario no encontrado`);
  }

  if (!vipStatus) {
    return res.status(400).send(`Bad Request`);
  }

  users[exists].vipStatus = CONSTANTS.VIP_STATUS[vipStatus];

  return res.send(users[exists]);
});

// Delete user with username
router.delete('/:uname', (req, res) => {
  const {uname} = req.params;
  const index = users.findIndex(user => user.username === uname);

  if (index === -1) {
    return res.status(404).send(`Usuario no encontrado`);
  }

  users[index].active = false;

  res.json(users);
});

// Login user
router.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  //Solo se pueden loggear usuarios activos
  const activeUsers = users.filter(user => user.active === true );

  const result = activeUsers.find(user => user.email === email);

  if (!result) {
    res.status(404).send(`Usuario no encontrado`);
  }

  if (result.password !== password) {
    return res.status(401).send(`No autorizado`)
  }

  res.json(result);
});

module.exports = router;
