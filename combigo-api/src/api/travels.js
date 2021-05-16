const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOT';

const travels = require('./store').travels;
const routes = require('./store').routes;
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
    res.status(404).send(`Viaje no encontrado`);
  }
  res.json(result);
});

// Create travel, con id, y DateAndTime, ¿vehiculo y chofer? Como cheqeuamos?
router.post('/', (req, res) => {
  const {dateAndTime, availableAdditionals, vehicle, driver, route} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const routeExists = routes.find(route => route.id === route);
  if (routeExists === -1) { 
    return res.status(409).send(`La ruta ingresada no existe`);
  }

  travels.push({
    id: `${ID_BASE}${travels.length + 1}`,
    dateAndTime,
    passengers: [],
    driver: driver,
    route: route,
    vehicle: vehicle,
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals,
    boughtAdditionals: [],
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
    return res.status(409).send(`El viaje no existe`);
  }

  travels[exists] = {
    id,
    dateAndTime,
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
    return res.status(409).send(`El viaje no existe`);
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
    return res.status(409).send(`El viaje no existe`);
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
    return res.status(409).send(`El viaje no existe`);
  }

  travels[exists].boughtAdditionals.push( additional );

  res.send(additional);
});

// Delete travel with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  
  const index = travels.findIndex(travel => travel.id === id);
  if (index === -1) {
    return res.status(404).send(`Viaje no encontrado`);
  }

  travels.splice(index, 1);

  res.json(travels);
});

module.exports = router;
