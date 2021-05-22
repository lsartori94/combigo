const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOV';

const vehicles = require('./store').vehicles;

// Get active vehicles
router.get('/', (req, res) => {
  const activeVehicles = vehicles.filter(vehicles => vehicles.active === true );

  res.json(activeVehicles);
});

// Search for vehicle with ID
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const result = vehicles.find(veh => veh.id === id);

  if (!result) {
    res.status(404).send(`Vehiculo no encontrado`);
  }

  res.json(result);
});

// Create vehicle
router.post('/', (req, res) => {
  const {name, brand, plate, capacity} = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }

  if (!capacity) {
    return res.status(409).send(`Capacidad inválida`)
  }
  
  const activeVehicles = vehicles.filter(vehicles => vehicles.active === true );
  const exists = activeVehicles.find(veh => veh.plate === plate);

  if (exists) {
    return res.status(409).send(`Vehiculo con patente ingresada ya existe`);
  }

  vehicles.push({
    id: `${ID_BASE}${vehicles.length + 1}`,
    name,
    brand,
    plate,
    capacity,
    active: true,
  });

  res.send(vehicles);
});

// Modify vehicle with id
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {name, brand, plate, capacity, active} = req.body;

  if (!req.body || !capacity) {
    return res.status(400).send(`Bad Request`)
  }

  const activeVehicles = vehicles.filter(veh => veh.active === true );
  const exists = vehicles.findIndex(veh => veh.id === id);

  if (exists === -1) {
    return res.status(409).send(`Vehiculo no existe`);
  }

  if (vehicles[exists].active == false) {
    return res.status(405).send(`Vehiculo inactivo`);
  }

  const plateExists = activeVehicles.find(veh => (veh.plate === plate) && (veh.id != id));

  if (plateExists) {
    return res.status(409).send(`Vehiculo con patente ingresada ya existe`);
  }

  vehicles[exists] = {
    id,
    name,
    brand,
    plate,
    capacity,
    active
  };

  res.send(vehicles);
});

// Delete vehicle with id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const index = vehicles.findIndex(veh => veh.id === id);

  if (index === -1) {
    return res.status(404).send(`Vehiculo no encontrado`);
  }

  vehicles[index].active = false;

  res.json(vehicles);
});

module.exports = router;
