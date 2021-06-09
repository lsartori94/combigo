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
  const {dateAndTime, route} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const routeIndex = routes.findIndex(each => each.id === route);
  if (routeIndex === -1) { 
    return res.status(409).send(`La ruta ingresada no existe`);
  }
  const newId = `${ID_BASE}${travels.length + 1}`

  const newTravel = {
    id: newId,
    dateAndTime,
    route,
    status: TRAVEL_STATES.NO_VEHICLE,
    availableAdditionals: [],
    driver: null,
    vehicle: null,
    passengers: [],
    boughtAdditionals: [],
    active: true,
  };

  travels.push(newTravel);

  // Agrega la referencia del nuevo viaje a la ruta
  routes[routeIndex].travels.push(newId);

  res.send(newTravel);
});

// Modify Vehicle
router.put('/:id/vehicle', (req, res) => {
  const {id} = req.params;
  const {vehicle} = req.body;

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

  travels[exists] = Object.assign(
    travels[exists],
    {
      vehicle,
      stock: vehicle.capacity,
      status: TRAVEL_STATES.NOT_STARTED
    }
  );

  res.send(travels[exists]);
});

// Modify Additionals
router.put('/:id/additionals', (req, res) => {
  const {id} = req.params;
  const {availableAdditionals} = req.body;

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

  travels[exists].availableAdditionals = availableAdditionals;
  res.send(travels[exists]);
});

// Modify Driver
router.put('/:id/driver', (req, res) => {
  const {id} = req.params;
  const {driver} = req.body;

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

  travels[exists].driver = driver;

  res.send(travels[exists]);
});

// Modify Basic info
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {dateAndTime, route, status} = req.body;

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

  travels[exists] = Object.assign(travels[exists],{
    dateAndTime,
    route,
    status
  });

  res.send(travels[exists]);
});

// Delete travel with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  
  const index = travels.findIndex(travel => travel.id === id);
  if (index === -1) {
    return res.status(404).send(`Viaje no encontrado`);
  }
  
  travels[index].active = false;

  res.json(travels);
});

// Add new booking
router.put('/:id/newBooking', (req, res) => {
  const {id} = req.params;
  const booking = req.body;

  console.log(booking);

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

  travels[exists].passengers.push(booking);

  res.send(booking);
});

// cancel booking
router.put('/:id/cancelBooking', (req, res) => {
  const {id} = req.params;
  const booking = req.body;

  console.log(booking);

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

  if (travels[exists].status !== TRAVEL_STATES.NOT_STARTED ) {
    return res.status(405).send(`Solo se puede cancelar un viaje pendiente`);
  }

  const existsBooking = travels[exists].passengers.findIndex(abook => abook.id === booking.id);
  travels[exists].passengers.splice( index, existsBooking )

  res.send(booking);
});

module.exports = router;
