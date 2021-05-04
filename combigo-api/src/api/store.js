const { ROLES } = require('./constants');

const users = [
  {
    username: 'admin',
    email: 'admin@gmail.com',
    name: 'Admin',
    password: 'admin123',
    bdate: '', 
    role: ROLES.ADMIN
  },
  {
    username: 'jose.traffic',
    email: 'joset@gmail.com',
    name: 'Jose',
    password: 'jose123',
    bdate: '12/12/1960',
    role: ROLES.DRIVER
  },
  { 
    username: 'juan.perez',
    email: 'juanp@gmail.com',
    name: 'Juan',
    password: 'juan123',
    bdate: '12/11/1990',
    role: ROLES.CLIENT
  },
  { 
    username: 'diego.sosa',
    email: 'diegod@gmail.com',
    name: 'Diego',
    password: 'diego123',
    bdate: '12/10/1995',
    role: ROLES.CLIENT
  }
];

const vehicles = [
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

  const additionals = [
    {
      id: '1',
      name: 'Caja de 8 chicles de frutilla Beldent'
    },
    {
      id: '2',
      name: 'Caja de 6 alfajores Jorjito'
    },
    { 
      id: '3',
      name: 'Caja de 6 conitos Havana'
    },
    { 
      id: '4',
      name: 'Botella 200ml de Pepsi'
    },
    { 
      id: '5',
      name: 'Botella 200ml de Coca Cola'
    }
  ];

  const routes = [
    {
      origin: 'La Plata',
      destination: 'Buenos Aires',
      travels: [],
    },
    {
      origin: 'Buenos Aires',
      destination: 'Cordoba',
      travels: [],
    },
    {
      origin: 'Buenos Aires',
      destination: 'La Plata',
      travels: [],
    },
    { 
      origin: 'La Plata',
      destination: 'Mar del Plata',
      travels: [],
    },
    { 
      origin: 'Buenos Aires',
      destination: 'Cordoba',
      travels: [],
    }
  ];

  const travels = [
    {
      id: 'no se si necesita pero creo que si',
      dateAndTime: new Date(2021,7,20,7,30,0,0),
      passengers: [],
      driver: 'un chofer',
      vehicle: 'un vehiculo',
      state: 'Not started', //not started, ongoing, finished
      posibleAdditionals: [],
      boughtAdditionals: []
    },
    {
      id: '001',
      dateAndTime: new Date(2021,0,10,10,30,0,0),
      passengers: [],
      driver: 'un chofer 2',
      vehicle: 'un vehiculo 2',
      state: 'Finished', //not started, ongoing, finished
      posibleAdditionals: [],
      boughtAdditionals: []
    }
  ]

module.exports = {users, vehicles, additionals, routes};