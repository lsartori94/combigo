const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOT';

const travels = require('./store').travels;
const routes = require('./store').routes;
const TRAVEL_STATES = require('./constants').TRAVEL_STATES;

// Get all travels
router.get('/', (req, res) => {
  const activeTravels = travels.filter(travels => travels.active === true);
  res.json(activeTravels);
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

// Create travel with ID
router.post('/', (req, res) => {
  const {dateAndTime, route, availableAdditionals} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const routeIndex = routes.findIndex(each => each.id === route);
  if (routeIndex === -1) { 
    return res.status(409).send(`La ruta ingresada no existe`);
  }
  const newId = `${ID_BASE}${travels.length + 1}`

  travels.push({
    id: newId,
    dateAndTime,
    route,
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals,
    driver: " ",
    vehicle: " ",
    passengers: [],
    boughtAdditionals: [],
    active: true,
  });

  // Agrega la referencia del nuevo viaje a la ruta
  routes[routeIndex].travels.push(newId);

  res.send(travels);
});

// Modify travel with id. Creo que todo deberia tener un setter porque todo cambia demasiado
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {dateAndTime, route, vehicle, driver, availableAdditionals, passengers, status, boughtAdditionals} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = travels.findIndex(travel => travel.id === id);

  if (exists === -1) {
    return res.status(409).send(`El viaje no existe`);
  }

  if (travels[exists].active == false) {
    return res.status(405).send(`El viaje no esta activo`);
  }

  travels[exists] = {
    id,
    dateAndTime,
    route,
    status,
    availableAdditionals,
    driver,
    vehicle,
    passengers,
    boughtAdditionals,
    active: true,
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

  if (travels[exists].active == false) {
    return res.status(405).send(`El viaje no esta activo`);
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

  if (travels[exists].active == false) {
    return res.status(405).send(`El viaje no esta activo`);
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

  if (travels[exists].active == false) {
    return res.status(405).send(`El viaje no esta activo`);
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

  //travels.splice(index, 1);
  travels[index].active = false;

  res.json(travels);
});

module.exports = router;
