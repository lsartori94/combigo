const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOA';

const additionals = require('./store').additionals;

// Get active additionals
router.get('/', (req, res) => {
  const activeAdditionals = additionals.filter(additional => additional.active === true );

  res.json(activeAdditionals);
});

// Search for additional with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = additionals.find(additional => additional.id === id);

  if (!result) {
    res.status(404).send(`Adicional no encontrado`);
  }

  res.json(result);
});

// Create additional
router.post('/', (req, res) => {
  const {name, price} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`);
  }

  const activeAdditionals = additionals.filter(additional => additional.active === true );

  const nameExists = activeAdditionals.find(additional => additional.name === name);

  if (nameExists) {
    return res.status(409).send(`El adicional ya existe`);
  }

  additionals.push({
    id: `${ID_BASE}${additionals.length + 1}`,
    name,
    price,
    sold: false,
    active: true,
  });

  res.send(additionals);
});

// Modify additional with ID
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {name, price, sold, active} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`);
  };

  const activeAdditionals = additionals.filter(additional => additional.active === true );

  const exists = additionals.findIndex(additional => additional.id === id);
  
  if (exists === -1) {
    return res.status(409).send(`Adicional no encontrado`);
  };

  const nameExists = activeAdditionals.find(additional => (additional.name === name) && (additional.id != id));

  if (nameExists) {
    return res.status(409).send(`El adicional ya existe`);
  };

  additionals[exists] = {
    id,
    name,
    price,
    sold,
    active,
  };

  res.send(additionals);
});

// Delete additional with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const index = additionals.findIndex(additional => additional.id === id);

  if (index === -1) {
    return res.status(404).send(`Adicional no encontrado`);
  }

  additionals[index].active = false;

  res.json(additionals);
});

module.exports = router;
