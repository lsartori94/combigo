const express = require('express');

const router = express.Router();

const { TRAVEL_STATES } = require('./constants');

const ID_BASE = 'CGOR';

const {routes, travels} = require('./store');

// Get all routes
router.get('/', (req, res) => {
  res.json(routes);
});

// Search for route with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = routes.find(route => route.id === id);

  if (!result) {
    res.status(404).send(`Route not found`);
  }
  res.json(result);
});

// Search for routes by origin
router.get('/:origin', (req, res) => {
  const {origin} = req.params;
  const result = routes.filter(route => route.origin === origin);

  if (!result) {
    res.status(404).send(`No routes for origin`);
  }
  res.json(result);
});

// Search for routes by destination
router.get('/:destination', (req, res) => {
  const {destination} = req.params;
  const result = routes.filter(route => route.destination === destination);

  if (!result) {
    res.status(404).send(`No routes for destination`);
  }
  res.json(result);
});

// Create route
router.post('/', (req, res) => {
  const {origin, destination, distanceKm, durationMin} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  if (origin === destination) {
    return res.status(409).send(`Routes can't have same origin and destination`);
  }

  const exists = routes.find( route =>
    route.origin === origin &&  route.destination === destination);

  if (exists) {
    return res.status(409).send(`La Ruta con "origen-destino" ingresados ya existe`);
  }

  routes.push({
    id: `${ID_BASE}${routes.length + 1}`,
    origin,
    destination,
    distanceKm,
    durationMin,
    travels: [],
  });

  res.send(routes);
});

// Add a Travel with the id of a route
router.put('/:id/travels', (req, res) => {
  const {id} = req.params;
  const {travel} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = routes.findIndex(route => route.id === id);

  if (exists === -1) {
    return res.status(409).send(`Route does not exists`);
  }

  //Que no cargen el mismo viaje dos veces a su ruta
  const repeated = routes.travels.find(trav => trav.id === travel.id);

  if (repeated) {
    return res.status(409).send(`travel already exists`);
  }

  //Que no cargen dos viajes al mismo tiempo

  routes[exists].travels.push(travel);

  res.send(routes);
});

// Modify route with id
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {origin, destination, durationMin, distanceKm} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = routes.findIndex(route => route.id === id);

  if (exists === -1) {
    return res.status(409).send(`Route does not exists`);
  }

  const originDestExists = routes.find( route => 
    (route.origin === origin) && (route.destination === destination) && (route.id != id));

  if (originDestExists) {
    return res.status(409).send(`La Ruta con "origen-destino" ingresados ya existe`);
  }

  routes[exists] = {
    id,
    origin,
    destination,
    durationMin,
    distanceKm
  };

  res.send(routes);
});

// Delete route with id 
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  
  const index = routes.findIndex(route => route.id === id);
  if (index === -1) {
    return res.status(404).send(`Route not found`);
  }

  //CAMBIAR POR UNA LLAMADA A CANCELAR VIAJE CUANDO LO IMPLEMENTEMOS
  routes[index].travels.forEach(travel => {
    const travelIndex = travels.findIndex(item => item.id === travel.id);
    if (travelIndex > -1 && travels[travelIndex].status == TRAVEL_STATES.NOT_STARTED) {
      travels[travelIndex].status = TRAVEL_STATES.CANCELED;
    }
  })

  routes.splice(index, 1);

  res.json(routes);
});

module.exports = router;
