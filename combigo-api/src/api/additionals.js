const express = require('express');

const router = express.Router();

<<<<<<< HEAD
=======
const ID_BASE = 'CGOA';

>>>>>>> 70990840dfaf1ccca2d327a91c8f7dcf46312f73
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
    return res.status(400).send(`Bad Request`)
  }

  const exists = additionals.find(additional => additional.name === name);

  if (exists) {
<<<<<<< HEAD
    return res.status(409).send(`Aditional already exists`);
  }

  additionals.push({
    id: `${additionals.length + 1}`,
    name,
  });

  additionals = newAditionals;
=======
    return res.status(409).send(`Additional already exists`);
  }

  additionals.push({
    id: `${ID_BASE}${additionals.length + 1}`,
    name,
  });
>>>>>>> 70990840dfaf1ccca2d327a91c8f7dcf46312f73

  res.send(additionals);
});

// Modify Additional with id 
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {name} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = additionals.findIndex(additional => additional.id === id);

  if (exists === -1) {
<<<<<<< HEAD
    return res.status(409).send(`Aditional does not exists`);
=======
    return res.status(409).send(`Additional does not exists`);
>>>>>>> 70990840dfaf1ccca2d327a91c8f7dcf46312f73
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
<<<<<<< HEAD
    return res.status(404).send(`Aditional not found`);
=======
    return res.status(404).send(`Additional not found`);
>>>>>>> 70990840dfaf1ccca2d327a91c8f7dcf46312f73
  }

  additionals.splice(index, 1);

  res.json(additionals);
});

module.exports = router;
