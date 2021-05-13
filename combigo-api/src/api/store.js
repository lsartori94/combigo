const { ROLES, TRAVEL_STATES, LEGAL_STATUS } = require('./constants');

let users = [
  {
    id: 'CGOU0',
    username: 'admin',
    email: 'admin',
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
    password: '123@Pass',
    bdate: '1960-12-12',
    dni: '34506758',
    completedTravels: [],
    role: ROLES.DRIVER
  },
  {
    id: 'CGOU2',
    username: 'juan.perez',
    email: 'juanp@gmail.com',
    name: 'Juan',
    password: '123@Pass',
    bdate: '1990-11-12',
    dni: '37502385',
    travelHistory: [],
    role: ROLES.CLIENT
  },
  {
    id: 'CGOU3',
    username: 'diego.sosa',
    email: 'diegod@gmail.com',
    name: 'Diego',
    password: '123@Pass',
    bdate: '1995-10-12',
    dni: '42357195',
    travelHistory: [
      {
        travelDetails: {},
        boughtAdditionals: []
      }
    ],
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
    distanceKm: 30,
    durationMin: 40,
    travels: [
      {
        id: 'CGOT1'
      }
    ],
  },
  {
    id: 'CGOR2',
    origin: 'Buenos Aires',
    destination: 'Cordoba',
    distanceKm: 600,
    durationMin: 400,
    travels: [],
  },
  {
    id: 'CGOR3',
    origin: 'Buenos Aires',
    destination: 'La Plata',
    distanceKm: 30,
    durationMin: 40,
    travels: [
      {
        id: 'CGOT2'
      }
    ],
  },
  { 
    id: 'CGOR4',
    origin: 'Buenos Aires',
    destination: 'Rosario',
    distanceKm: 300,
    durationMin: 200,
    travels: [],
  }
];

let travels = [
  {
    id: 'CGOT1',
    dateAndTime: "2021-06-01T08:30",
    route: "CGOR1",
    passengers: [
      {
        id: "CGOU3",
        legalStatus: LEGAL_STATUS.PENDING
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV1',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      "CGOA1",
      "CGOA3"
    ],
    boughtAdditionals: []
  },
  {
    id: 'CGOT2',
    dateAndTime: "2021-07-01T08:30",
    route: "CGOR3",
    passengers: [
      {
        id: "CGOU3",
        legalStatus: LEGAL_STATUS.APPROVED
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV1',
    status: TRAVEL_STATES.FINISHED,
    availableAdditionals: [
      "CGOA2",
      "CGOA4",
      "CGOA5"
    ],
    boughtAdditionals: []
  },
  {
    id: 'CGOT3',
    dateAndTime: "2021-07-01T08:30",
    route: "CGOR3",
    passengers: [
      {
        id: "CGOU3",
        legalStatus: LEGAL_STATUS.APPROVED
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV1',
    status: TRAVEL_STATES.FINISHED,
    availableAdditionals: [
      "CGOA2",
      "CGOA4",
      "CGOA5"
    ],
    boughtAdditionals: [],
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