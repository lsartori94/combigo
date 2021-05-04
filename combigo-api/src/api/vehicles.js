const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOV';

const vehicles = require('./store').vehicles;

// Get all vehicles
router.get('/', (req, res) => {
  res.json(vehicles);
});

// Search for vehicle with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = vehicles.find(veh => veh.id === id);

  if (!result) {
    res.status(404).send(`Vehicle not found`);
  }

  res.json(result);
});

// Create vehicle
router.post('/', (req, res) => {
  const {name, brand, plate, capacity} = req.body;

  if (!req.body || !capacity) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = vehicles.find(veh => veh.plate === plate);

  if (exists) {
    return res.status(409).send(`Vehicle plate already exists`);
  }

  vehicles.push({
    id: `${ID_BASE}${vehicles.length + 1}`,
    name,
    brand,
    plate,
    capacity,
  });

  res.send(vehicles);
});

// Modify vehicle with id
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {name, brand, plate, capacity} = req.body;

  if (!req.body || !capacity) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = vehicles.findIndex(veh => veh.id === id);

  if (exists === -1) {
    return res.status(409).send(`Vehicle does not exists`);
  }

  vehicles[exists] = {
    id,
    name,
    brand,
    plate,
    capacity,
  };

  res.send(vehicles);
});

// Delete vehicle with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const index = vehicles.findIndex(veh => veh.id === id);

  if (index === -1) {
    return res.status(404).send(`Vehicle not found`);
  }

  vehicles.splice(index, 1);

  res.json(vehicles);
});

module.exports = router;
