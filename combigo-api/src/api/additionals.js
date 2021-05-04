const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOA';

const additionals = require('./store').additionals;

// Get all additionals
router.get('/', (req, res) => {
  res.json(additionals);
});

// Search for additional with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = additionals.find(additional => additional.id === id);

  if (!result) {
    res.status(404).send(`Aditional not found`);
  }

  res.json(result);
});

// Create Additional
router.post('/', (req, res) => {
  const {name} = req.body;

  if (!req.body) {
    res.status(400).send(`Bad Request`)
  }

  const exists = additionals.find(additional => additional.name === name);

  if (exists) {
    res.status(409).send(`Additional already exists`);
  }

  const newAdditionals = [...additionals, {
    id: `${additionals.length + 1}`,
    name,
  }];

  additionals = newAdditionals;

  res.send(additionals);
});

// Modify Additional with id 
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {name} = req.body;

  if (!req.body) {
    res.status(400).send(`Bad Request`)
  }

  const exists = additionals.findIndex(additional => additional.id === id);

  if (exists === -1) {
    res.status(409).send(`Additional does not exists`);
  }

  additionals[exists] = {
    id,
    name,
  };

  res.send(additionals);
});

// Delete additional with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const index = additionals.findIndex(additional => additional.id === id);

  if (index === -1) {
    res.status(404).send(`Additional not found`);
  }

  additionals.splice(index, 1);

  res.json(additionals);
});

module.exports = router;
