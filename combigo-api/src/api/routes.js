const express = require('express');

const router = express.Router();

const { TRAVEL_STATES } = require('./constants');

const ID_BASE = 'CGOR';

const {routes, travels} = require('./store');

// Get active routes
router.get('/', (req, res) => {
  const activeRoutes = routes.filter(route => route.active === true );

  res.json(activeRoutes);
});

// Search for route with id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = routes.find(route => route.id === id);

  if (!result) {
    res.status(404).send(`Ruta no encontrada`);
  }
  res.json(result);
});

// get travels for route
router.get('/:routeId/travels', (req, res) => {
  const {routeId} = req.params;

  const routeValid = routes.find(r => r.id === routeId);
  if (!routeValid) return res.status(409).send(`La ruta ingresada no existe`);

  const result = travels.filter(t => t.route === routeId && t.active);
  return res.json(result);
});

// // Search for routes by origin
// router.get('/:origin', (req, res) => {
//   const {origin} = req.params;

//   const activeRoutes = routes.filter(routes => routes.active === true );
//   const result = activeRoutes.filter(route => route.origin === origin);

//   if (!result) {
//     res.status(404).send(`No hay rutas activas para el origen especificado`);
//   }
//   res.json(result);
// });

// // Search for routes by destination
// router.get('/:destination', (req, res) => {
//   const {destination} = req.params;

//   const activeRoutes = routes.filter(routes => routes.active === true );
//   const result = activeRoutes.filter(route => route.destination === destination);

//   if (!result) {
//     res.status(404).send(`No hay rutas activas para el destino especificado`);
//   }
//   res.json(result);
// });

// Create route
router.post('/', (req, res) => {
  const {origin, destination, distanceKm, durationMin} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  if (origin === destination) {
    return res.status(409).send(`La ruta no puede tener un origen y destino iguales`);
  }

  const activeRoutes = routes.filter(routes => routes.active === true );
  const exists = activeRoutes.find( route =>
    route.origin === origin &&  route.destination === destination);

  if (exists) {
    return res.status(409).send(`La ruta con "Origen-Destino" ingresados ya existe`);
  }

  routes.push({
    id: `${ID_BASE}${routes.length + 1}`,
    origin,
    destination,
    distanceKm,
    durationMin,
    travels: [],
    active: true,
  });

  res.send(routes);
});

// Add a Travel with the id of a route
router.put('/:id/travels', (req, res) => {
  const activeRoutes = routes.filter(routes => routes.active === true );
  const {id} = req.params;
  const {travel} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  const exists = routes.findIndex(route => route.id === id);

  if (exists === -1) {
    return res.status(404).send(`La ruta no existe`);
  }

  //Que no carguen un viaje a una ruta ya eliminada
  if (activeRoutes[exists].active = false) {
    return res.status(405).send(`La ruta fue deshabilitada`);
  }

  //Que no cargen el mismo viaje dos veces a su ruta
  const repeated = routes.travels.find(trav => trav.id === travel.id);

  if (repeated) {
    return res.status(409).send(`El viaje ya existe en la misma ruta`);
  }

  //Que no cargen dos viajes al mismo tiempo

  routes[exists].travels.push(travel);

  res.send(routes);
});

// Modify route with id
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {origin, destination, durationMin, distanceKm, travels, active} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  if (origin === destination) {
    return res.status(409).send(`La ruta no puede tener un origen y destino iguales.`);
  }

  const exists = routes.findIndex(route => route.id === id);

  if (exists === -1) {
    return res.status(404).send(`La ruta no existe`);
  }

  const activeRoutes = routes.filter(routes => routes.active === true );

  const originDestExists = activeRoutes.find( route => 
    (route.origin === origin) && (route.destination === destination) && (route.id != id));

  if (originDestExists) {
    return res.status(409).send(`La ruta con "Origen-Destino" ingresados ya existe.`);
  }

  routes[exists] = {
    id,
    origin,
    destination,
    durationMin,
    distanceKm,
    travels,
    active
  };

  res.send(routes);
});

// Delete route with id 
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const index = routes.findIndex(route => route.id === id);

  if (index === -1) {
    return res.status(404).send(`La ruta no existe`);
  }
  
  //Cambia estado de todos los viajes "pendiente" de la ruta a "cancelado"
  //#TODO devolver dinero de reservas
  routes[index].travels.forEach(routeTravel => {
    const travelIndex = travels.findIndex(travel => travel.id === routeTravel);
    if (travelIndex !== -1 && travels[travelIndex].status === TRAVEL_STATES.NOT_STARTED) {
      travels[travelIndex].status = TRAVEL_STATES.CANCELED;
    }
  });

  routes[index].active = false;

  res.json(routes);
});

module.exports = router;
