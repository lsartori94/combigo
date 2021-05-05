const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOR';

const routes = require('./store').routes;

// Get all routes
router.get('/', (req, res) => {
  res.json(routes);
});

// Search for route with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = routes.find(route => route.id === id);

  if (!result) {
    res.status(404).send(`route not found`);
  }
  res.json(result);
});

// Search for route by origin
router.get('/:origin', (req, res) => {
  const {origin} = req.params;
  const result = routes.filter(route => route.origin === origin);

  if (!result) {
    res.status(404).send(`No routes not found`);
  }
  res.json(result);
});

// Search for route by destination
router.get('/:destination', (req, res) => {
  const {destination} = req.params;
  const result = routes.filter(route => route.destination === destination);

  if (!result) {
    res.status(404).send(`No routes not found`);
  }
  res.json(result);
});

// Search for route by origin and destination
router.get('/:originDestination', (req, res) => {
  const {origin, destination} = req.params;

  const result = routes.filter(route => route.origin === origin);
  if (!result) {
    res.status(404).send(`No routes not found`);
  }
  const result = routes.filter(route => route.destination === destination);
  if (!result) {
    res.status(404).send(`No routes not found`);
  }

  res.json(result);
});

// Create route
router.post('/', (req, res) => {
  const {origin, destination} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = routes.find( route => route.origin === origin);
  if (exists) {
    return res.status(409).send(`route already exists`);
  }
  const exists = exists.find( route => route.destination === destination);
  if (exists) {
    return res.status(409).send(`route already exists`);
  }

  routes.push({
    id: `${ID_BASE}${routes.length + 1}`,
    origin: origin,
    destination: destination,
    travels: [],
  });

  res.send(routes);
});

// Add a Travel
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {aTravel} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = routes.findIndex(route => route.id === id);

  if (exists === -1) {
    return res.status(409).send(`route does not exists`);
  }

  //Que no cargen el mismo viaje dos veces a su ruta
  const repeated = routes.travels.find(trav => trav.id === aTravel.id);

  if (repeated) {
    return res.status(409).send(`travel already exists`);
  }

  routes[exists].travels.push(aTravel);

  res.send(routes);
});

// Modify route with id
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {origin, destination} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = routes.findIndex(route => route.id === id);

  if (exists === -1) {
    return res.status(409).send(`route does not exists`);
  }

  routes[exists] = {
    id: id,
    origin: origin,
    destination: destination,
  };

  res.send(routes);
});

// Delete route with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  
  const index = routes.findIndex(route => route.id === id);
  if (index === -1) {
    return res.status(404).send(`route not found`);
  }

  routes.splice(index, 1);

  res.json(routes);
});

module.exports = router;
