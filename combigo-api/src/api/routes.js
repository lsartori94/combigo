const express = require('express');

const router = express.Router();

const routes = require('./store').routes;

// Get all routes
router.get('/', (req, res) => {
  res.json(routes);
});

// Search for route with origin and destination
router.get('/:id', (req, res) => {
  const {origin, destination} = req.params;
  const result = routes.find(route => route.origin === origin);

  if (!result) {
    res.status(404).send(`route not found`);
  }

  const result = result.find(route => route.destination === destination);

  if (!result) {
    res.status(404).send(`route not found`);
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
    origin,
    destination,
  });

  res.send(routes);
});

// Modify route with origin and destination Es neesario????????

// Delete route with origin and destination
router.delete('/:id', (req, res) => {
  const {origin, destination} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }
  
  const index = routes.findIndex(route => route.origin === origin);
  if (index === -1) {
    return res.status(404).send(`Vehicle not found`);
  }
  const index = index.findIndex(route => route.destination === destination);
  if (index === -1) {
    return res.status(404).send(`Vehicle not found`);
  }

  routes.splice(index, 1);

  res.json(routes);
});

module.exports = router;
