const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOT';

const travels = require('./store').travels;
const TRAVEL_STATES = require('./constants').TRAVEL_STATES;

// Get all travels
router.get('/', (req, res) => {
  res.json(travels);
});

// Search for travel with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = travels.find(travel => travel.id === id);

  if (!result) {
    res.status(404).send(`travel not found`);
  }
  res.json(result);
});

// Create travel, con id, y DateAndTime, ¿vehiculo y chofer? Como cheqeuamos?
router.post('/', (req, res) => {
  const {dateAndTime, vehicle, driver} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  travels.push({
    id: `${ID_BASE}${travels.length + 1}`,
    dateAndTime: dateAndTime,
    passengers: [],
    driver: driver,
    vehicle: vehicle,
    status: TRAVEL_STATES.NOT_STARTED,
    posibleAdditionals: [],
    boughtAdditionals: []
  });

  res.send(travels);
});

// Modify travel with id. Creo que todo deberia tener un setter porque todo cambia demasiado
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {route, passengers, dateAndTime, vehicle, driver, availableAdditionals} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = travels.findIndex(travel => travel.id === id);

  if (exists === -1) {
    return res.status(409).send(`travel does not exists`);
  }

  travels[exists] = {
    id: id,
    dateAndTime: dateAndTime,
    driver: driver,
    vehicle: vehicle,
    route,
    passengers,
    availableAdditionals,
    status: travels[exists].status
  };

  res.send(travels);
});

// Add passenger
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {passenger} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = travels.findIndex(travel => travel.id === id);

  if (exists === -1) {
    return res.status(409).send(`travel does not exists`);
  }

  travels[exists].passengers.push( passenger )

  res.send(passenger);
});

// Add possibleAdditional
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {additional} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = travels.findIndex(travel => travel.id === id);

  if (exists === -1) {
    return res.status(409).send(`travel does not exists`);
  }

  travels[exists].posibleAdditionals.push( additional )

  res.send(additional);
});

// Add boughtAdditional // Esto se podria hacer muy distinto para que lleve cuenta de la cantidad de cada adicional...
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {additional} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = travels.findIndex(travel => travel.id === id);

  if (exists === -1) {
    return res.status(409).send(`travel does not exists`);
  }

  travels[exists].boughtAdditionals.push( additional )

  res.send(additional);
});

// Delete travel with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  
  const index = travels.findIndex(travel => travel.id === id);
  if (index === -1) {
    return res.status(404).send(`travel not found`);
  }

  travels.splice(index, 1);

  res.json(travels);
});

module.exports = router;
