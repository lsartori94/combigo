const express = require('express');

const router = express.Router();

const ID_BASE = 'CGOT';
const TICKET_BASE = 'CGOTKT';

const { travels, routes, users, vehicles, blacklist} = require('./store');
const { TRAVEL_STATES, BOOKING_STATES, ROLES, LEGAL_STATUS }= require('./constants');

// Get active travels
router.get('/', (req, res) => {
  const activeTravels = travels.filter(travels => travels.active === true);
  res.json(activeTravels);
});

// Get all travels
// Para que bookings siga funcionando si se elimina un travel
router.get('/all', (req, res) => {
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
    stock: null,
    price: 100
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
  const existsV = vehicles.findIndex(v => v.id === vehicle);

  if (exists === -1) {
    return res.status(409).send(`El viaje no existe`);
  }

  if (existsV === -1) {
    return res.status(409).send(`El vehiculo`);
  }

  if (travels[exists].active == false) {
    return res.status(405).send(`El viaje no esta activo`);
  }

  travels[exists] = Object.assign(
    travels[exists],
    {
      vehicle: vehicles[existsV].id,
      stock: vehicles[existsV].capacity,
      status: TRAVEL_STATES.NOT_STARTED
    }
  );

  console.log(travels)

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

  const validTravels = travels.filter(trav => 
    (trav.status !== TRAVEL_STATES.FINISHED && 
    trav.status !== TRAVEL_STATES.CANCELED) 
    && (trav.active === true));
  
  const tempTravel = {};
  Object.assign(tempTravel, travels[exists]);
  tempTravel.dateAndTime = dateAndTime;
  let driverOverlap, vehicleOverlap = false;

  // nuevo dateAndTime overlaps drivers
  if (travels[exists].driver) {
    const sameDriverTravels = validTravels.filter(travel => travel.driver === travels[exists].driver);
    if (sameDriverTravels.length > 0)
      driverOverlap = sameDriverTravels.some(travel => datesOverlap(tempTravel, travel));
  };

  // nuevo dateAndTime overlaps vehicles
  if (travels[exists].vehicle){
    const sameVehicleTravels = validTravels.filter(travel => travel.vehicle === travels[exists].vehicle);
    if (sameVehicleTravels.length > 0)
      vehicleOverlap = sameVehicleTravels.some(travel => datesOverlap(tempTravel, travel));
  };

  if (vehicleOverlap || driverOverlap) {
    return res.status(405).send(`Nueva fecha elegida tiene conflictos de combi/chofer respecto a otros viajes.`);
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
  travels[index].status = TRAVEL_STATES.CANCELED;
  travels[index].passengers.forEach(p =>{
    p.bookingStatus = BOOKING_STATES.CANCELED; //sacar esto
    users.find(
      e => e.id === p.id
    ).travelHistory.find(
      t => (t.travelId === travels[index].id) && (t.status === BOOKING_STATES.PENDING)
    ).status = BOOKING_STATES.CANCELED;
  });

  res.json(travels);
});


// Add new booking
router.put('/:id/newBooking', (req, res) => {
  const {id} = req.params;
  const booking = req.body;

  if (!req.body) {
    return res.status(400).send(`Bad Request`)
  }
 
  const exists = travels.findIndex(travel => travel.id === id);
  const userExists = users.findIndex(user => booking.id === user.id);

  if (exists === -1) {
    return res.status(409).send(`El viaje no existe`);
  }

  if (userExists === -1) {
    return res.status(409).send(`El usuario no existe`);
  }

  if (travels[exists].active == false) {
    return res.status(405).send(`El viaje no esta activo`);
  }

  if (travels[exists].stock < 1) {
    return res.status(405).send(`El viaje ya no tiene asientos disponibles.`);
  }

  if (booking.creditCard === '3456789123456789') { //tarjeta sin fondos
    return res.status(405).send(`La tarjeta no tiene fondos para realizar la compra.`);
  }

  if (booking.creditCard === '3333333333333333') { //tarjeta invalida
    return res.status(405).send(`La tarjeta es inválida.`);
  }

  travels[exists].stock = travels[exists].stock - 1;
  const finalBooking = Object.assign(
    booking,
    {
      ticketId: `${TICKET_BASE}${travels[exists].passengers.length + 1}`
    }
  );
  travels[exists].passengers.push(finalBooking);
  users[userExists].travelHistory.push({
    travelId: travels[exists].id,
    bookingId: `CGOB${users[userExists].travelHistory.length + 1}`, //Agregado para el bookingId
    boughtAdditionals: booking.boughtAdditionals,
    status: BOOKING_STATES.PENDING,
    payment: finalBooking.payment,
    legalStatus: LEGAL_STATUS.PENDING
  });

  res.send(booking);
});

// Cancel booking
router.put('/:id/cancelBooking', (req, res) => {
  const {id} = req.params;
  const {user, idBooking} = req.body; //Cambio para bookingId

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

  const existsBooking = travels[exists].passengers.find(abook => abook.id === user);
  
  if (!existsBooking) {
    return res.status(405).send(`La reserva no existe`);
  }

  const time = travels[exists].dateAndTime;
  const ms = new Date(time).getTime();
  const now = Date.now();
  const diff = 48 * 60 * 60 * 1000;
  const userI = users.findIndex(u => u.id === user);

  if (userI === -1) {
    return res.status(405).send(`El usuario no existe`);
  }

  // if (ms - now >= diff) {
  //   // mas de 48hs
  //   users[userI].travelHistory.find(t => t.travelId === id).status = BOOKING_STATES.FULL_REFUND;
  // } else {
  //   // menos de 48hs
  //   users[userI].travelHistory.find(t => t.travelId === id).status = BOOKING_STATES.HALF_REFUND;
  // } //Cambio para BookingId

  if (ms - now >= diff) {
    // mas de 48hs
    users[userI].travelHistory.find(t => t.bookingId === idBooking).status = BOOKING_STATES.FULL_REFUND;
  } else {
    // menos de 48hs
    users[userI].travelHistory.find(t => t.bookingId === idBooking).status = BOOKING_STATES.HALF_REFUND;
  } 
  
  const newTravel = Object.assign(
    travels[exists],
    {
      stock: travels[exists].stock + 1,
      passengers: travels[exists].passengers.filter(p => p.id !== user)
    }
  );
  travels[exists] = newTravel;

  res.send(travels[exists]);
});


// Get valid drivers and vehicles for travel assign
router.get('/:id/validAssigns', (req, res) => {
  const {id} = req.params;
  const travel = travels.find(travel => travel.id === id);

  if (!travel) {
    res.status(404).send(`Viaje no encontrado`);
  }

  const drivers = users.filter(user => (user.role === ROLES.DRIVER) && (user.active === true));
  const validTravels = travels.filter(trav => 
    (trav.status !== TRAVEL_STATES.FINISHED && 
    trav.status !== TRAVEL_STATES.CANCELED) 
    && (trav.active === true));

  const overlappedTravels = validTravels.filter(otherTravel => datesOverlap(travel, otherTravel));
  const validDrivers = drivers.filter(driver => !overlappedTravels.some(trav => trav.driver === driver.id));
  const validVehicles = vehicles.filter(veh => !overlappedTravels.some(trav => trav.vehicle === veh.id));

  let validAssigns = {};
  validAssigns = Object.assign(
    validAssigns,
    {
      validDrivers,
      validVehicles
    }
  );

  res.json(validAssigns);
});

// Update a passenger legal status (declaration)
router.put('/:id/updateLegalStatus', (req, res) => {
  const {id} = req.params;
  const {symptoms, userId, bookingId} = req.body;

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
    return res.status(405).send(`Solo se puede llenar la declaracion de un viaje pendiente`);
  }

  const userExists = users.findIndex(user => user.id === userId);
  if (userExists === -1) {
    return res.status(405).send(`El usuario no existe`);
  }

  const passengerExists = travels[exists].passengers.findIndex(pas => pas.id === userId);
  if (passengerExists === -1) {
    return res.status(405).send(`El pasajero no existe`);
  }

  const bookingExists = users[userExists].travelHistory.findIndex(book => book.id == bookingId);
  if (bookingExists === -1) {
    return res.status(405).send(`La reserva no existe`);
  }

  let rejected = false;
  if (symptoms.includes("fever") || symptoms.length >= 2) {
    rejected = true;
  };
  
  if (rejected) {
    travels[exists].passengers[passengerExists].legalStatus = LEGAL_STATUS.REJECTED;
    users[userExists].travelHistory[bookingExists].legalStatus = LEGAL_STATUS.REJECTED;

    // TODO: cancelar además sus viajes y compras proximos 15 dias (usando insideFifteenDays())
    travels[exists].passengers[passengerExists].status = BOOKING_STATES.CANCELED;
    users[userExists].travelHistory[bookingExists].status = BOOKING_STATES.CANCELED

    blacklist.push(userId); //blacklist

  } else {
    travels[exists].passengers[passengerExists].legalStatus = LEGAL_STATUS.APPROVED;
    users[userExists].travelHistory[bookingExists].legalStatus = LEGAL_STATUS.APPROVED;
  };
  
  res.send(travels[exists]);
});

//Accept passenger on a trip
router.put('/:id/acceptPassenger', (req, res) => {
  const {id} = req.params;
  const {userId} = req.body;

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
    return res.status(405).send(`Solo se puede llenar la declaracion de un viaje pendiente`);
  }

  const userExists = users.findIndex(user => user.id === userId);
  if (userExists === -1) {
    return res.status(405).send(`El usuario no existe`);
  }

  const passengerExists = travels[exists].passengers.findIndex(pas => pas.id === userId);
  if (passengerExists === -1) {
    return res.status(405).send(`El pasajero no existe`);
  }

  const bookingExists = users[userExists].travelHistory.findIndex(book => book.id == bookingId);
  if (bookingExists === -1) {
    return res.status(405).send(`La reserva no existe`);
  }
  

  travels[exists].passengers[passengerExists].accepted = true;

  res.send(travels[exists]);
});

// Utilities
function datesOverlap(thisTravel, otherTravel) {
  if (otherTravel.id === thisTravel.id)
    return false;
  const route1 = routes.find(route => route.id === otherTravel.route);
  const route2 = routes.find(route => route.id === thisTravel.route);
  if ((!route1 || !route2) || (route1.active === false)) //check rutas eliminadas
    return false;
  const duration1 = route1.durationMin * 60000;
  const duration2 = route2.durationMin * 60000;
  const start1 = Date.parse(otherTravel.dateAndTime);
  const start2 = Date.parse(thisTravel.dateAndTime);
  const end1 = start1 + duration1;
  const end2 = start2 + duration2;
  if ((start1 <= end2) && (end1 >= start2)) 
    return true;
  return false;
};

function insideFifteenDays(datetime) {
  let today = new Date();
  let travelDate = new Date(datetime);

  let days = Math.floor((travelDate - today) / (1000*60*60*24));
  if (days <= 15) return true;
  return false;
};


module.exports = router;
