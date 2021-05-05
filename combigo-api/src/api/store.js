const { ROLES } = require('./constants');

let users = [
  {
    id: 'CGOU0',
    username: 'admin',
    email: 'admin@gmail.com',
    name: 'Admin',
    password: 'admin',
    bdate: '', 
    role: ROLES.ADMIN
  },
  {
    id: 'CGOU1',
    username: 'jose.traffic',
    email: 'joset@gmail.com',
    name: 'Jose',
    password: 'jose123',
    bdate: '1960-12-12',
    role: ROLES.DRIVER
  },
  {
    id: 'CGOU2',
    username: 'juan.perez',
    email: 'juanp@gmail.com',
    name: 'Juan',
    password: 'juan123',
    bdate: '1990-11-12',
    role: ROLES.CLIENT
  },
  {
    id: 'CGOU3',
    username: 'diego.sosa',
    email: 'diegod@gmail.com',
    name: 'Diego',
    password: 'diego123',
    bdate: '1995-10-12',
    role: ROLES.CLIENT
  }
];

let vehicles = [
  {
    id: 'CGOV1',
    name: 'Volvo 1',
    brand: 'Volvo',
    plate: 'ASDF1234',
    capacity: 12
  },
  {
    id: 'CGOV2',
    name: 'Volvo 2',
    brand: 'Volvo',
    plate: 'FGHI1234',
    capacity: 10
  }
];

let routes = [
  {
    id: 'CGOR1',
    origin: 'La Plata',
    destination: 'Buenos Aires',
    travels: [],
  },
  {
    id: 'CGOR2',
    origin: 'Buenos Aires',
    destination: 'Cordoba',
    travels: [],
  },
  {
    id: 'CGOR3',
    origin: 'Buenos Aires',
    destination: 'La Plata',
    travels: [],
  },
  {
    id: 'CGOR4',
    origin: 'La Plata',
    destination: 'Mar del Plata',
    travels: [],
  },
  { 
    id: 'CGOR5',
    origin: 'Buenos Aires',
    destination: 'Cordoba',
    travels: [],
  }
];

let travels = [
  {
    id: 'CGOT1',
    dateAndTime: new Date(2021,7,20,7,30,0,0),
    passengers: [],
    driver: 'un chofer',
    vehicle: 'un vehiculo',
    state: 'Not started', //not started, ongoing, finished
    posibleAdditionals: [],
    boughtAdditionals: []
  },
  {
    id: 'CGOT2',
    dateAndTime: new Date(2021,0,10,10,30,0,0),
    passengers: [],
    driver: 'un chofer 2',
    vehicle: 'un vehiculo 2',
    state: 'Finished', //not started, ongoing, finished
    posibleAdditionals: [],
    boughtAdditionals: []
  }
];

let additionals = [
  {
    id: 'CGOA1',
    name: 'Caja de 8 chicles de frutilla Beldent',
  },
  {
    id: 'CGOA2',
    name: 'Caja de 6 alfajores Jorjito',
  },
  { 
    id: 'CGOA3',
    name: 'Caja de 6 conitos Havana',
  },
  { 
    id: 'CGOA4',
    name: 'Botella 200ml de Pepsi',
  },
  { 
    id: 'CGOA5',
    name: 'Botella 200ml de Coca Cola',
  }
];

module.exports = {users, vehicles, additionals, routes, travels};