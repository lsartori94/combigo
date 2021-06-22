const { ROLES, TRAVEL_STATES, BOOKING_STATES, LEGAL_STATUS, VIP_STATUS } = require('./constants');

let users = [
  {
    id: 'CGOU0',
    username: 'admin',
    email: 'admin',
    name: 'Admin',
    password: 'admin',
    bdate: '', 
    role: ROLES.ADMIN,
    active: true
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
    role: ROLES.DRIVER,
    active: true
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
    creditCard: {
      issuer: 'Visa',
      number: '4983794057102007',
      cardHolder: 'Juan Perez',
      expDate: '2021-11-12',
      cvv:'123'
    },
    vipStatus: VIP_STATUS.NOT_ENROLLED,
    role: ROLES.CLIENT,
    active: true,
  },
  {
    id: 'CGOU3',
    username: 'diego.sosa',
    email: 'diegos@gmail.com',
    name: 'Diego',
    password: '123@Pass',
    bdate: '1995-10-12',
    dni: '42357195',
    travelHistory: [
      {
        travelId: 'CGOT1',
        bookingId: 'CGOB0', //Agregado para bookingId
        legalStatus: LEGAL_STATUS.PENDING,
        boughtAdditionals: [ 
          'CGOA1',
          'CGOA3',
        ],
        status: BOOKING_STATES.PENDING,
        payment: 350
      },
      {
        travelId: 'CGOT2',
        bookingId: 'CGOB1',
        legalStatus: LEGAL_STATUS.APPROVED,
        boughtAdditionals: [],
        status: BOOKING_STATES.COMPLETED,
        payment: 160
      },
      {
        travelId: 'CGOT3',
        bookingId: 'CGOB2',
        legalStatus: LEGAL_STATUS.APPROVED,
        boughtAdditionals: [],
        status: BOOKING_STATES.COMPLETED,
        payment: 200
      },
      {
        travelId: 'CGOT4',
        bookingId: 'CGOB3',
        legalStatus: LEGAL_STATUS.APPROVED,
        boughtAdditionals: [],
        status: BOOKING_STATES.ACTIVE,
        payment: 120
      }
    ],
    vipStatus: VIP_STATUS.NOT_ENROLLED,
    role: ROLES.CLIENT,
    active: true
  },
  {
    id: 'CGOU4',
    username: 'carlos.lopez',
    email: 'carlosl@gmail.com',
    name: 'Carlos',
    password: '123@Pass',
    bdate: '1990-11-12',
    dni: '30789453',
    travelHistory: [], 
    creditCard: {
      issuer: 'Visa',
      number: '567487647384',
      cardHolder: 'Carlos Lopez',
      expDate: '2022-11-12',
      cvv:'153'
    },
    vipStatus: VIP_STATUS.NOT_ENROLLED,
    role: ROLES.CLIENT,
    active: true,
  },
  {
    id: 'CGOU5',
    username: 'manuel.volvo',
    email: 'manuelv@gmail.com',
    name: 'Manuel',
    password: '123@Pass',
    bdate: '1980-12-12',
    dni: '34516758',
    completedTravels: [],
    role: ROLES.DRIVER,
    active: true
  },
  {
    id: 'CGOU6',
    username: 'john.volvo',
    email: 'johnv@gmail.com',
    name: 'John',
    password: '123@Pass',
    bdate: '1970-12-12',
    dni: '34616758',
    completedTravels: [],
    role: ROLES.DRIVER,
    active: true
  },
];

let vehicles = [
  {
    id: 'CGOV1',
    name: 'Volvo 1',
    brand: 'Volvo',
    plate: 'ASDF1234',
    capacity: 12,
    active: true,
  },
  {
    id: 'CGOV2',
    name: 'Volvo 2',
    brand: 'Volvo',
    plate: 'FGHI1234',
    capacity: 10,
    active: true,
  },
  {
    id: 'CGOV3',
    name: 'Mercedes 1',
    brand: 'Mercedes Benz',
    plate: 'JKML5678',
    capacity: 20,
    active: true,
  },
  {
    id: 'CGOV4',
    name: 'Duna',
    brand: 'Fiat',
    plate: 'AAA123',
    capacity: 2,
    active: true,
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
      'CGOT1'
    ],
    active: true
  },
  {
    id: 'CGOR2',
    origin: 'Buenos Aires',
    destination: 'Cordoba',
    distanceKm: 600,
    durationMin: 400,
    travels: [],
    active: true
  },
  {
    id: 'CGOR3',
    origin: 'Buenos Aires',
    destination: 'La Plata',
    distanceKm: 30,
    durationMin: 40,
    travels: [
      'CGOT2',
      'CGOT3'
    ],
    active: true
  },
  { 
    id: 'CGOR4',
    origin: 'Buenos Aires',
    destination: 'Rosario',
    distanceKm: 300,
    durationMin: 200,
    travels: [
      'CGOT4'
    ],
    active: true
  }
];

let travels = [
  {
    id: 'CGOT1',
    dateAndTime: '2021-06-21T21:00',
    route: 'CGOR1',
    stock: 1,
    passengers: [
      {
        id: 'CGOU3',
        legalStatus: LEGAL_STATUS.PENDING,
        bookingStatus: BOOKING_STATES.PENDING,
        creditCard: '4444444444444444',
        payment: 350,
        boughtAdditionals: [ 
          'CGOA1',
          'CGOA3',
        ],
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV4',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      'CGOA1',
      'CGOA3'
    ],
    price: 100,
    active: true
  },
  {
    id: 'CGOT2',
    dateAndTime: '2021-07-01T08:30',
    route: 'CGOR3',
    stock: 9,
    passengers: [
      {
        id: 'CGOU3',
        legalStatus: LEGAL_STATUS.APPROVED,
        bookingStatus: BOOKING_STATES.COMPLETED,
        creditCard: '4444444444444444',
        payment: 160,
        boughtAdditionals: [],
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV2',
    status: TRAVEL_STATES.FINISHED,
    availableAdditionals: [
      'CGOA2',
      'CGOA4',
      'CGOA5'
    ],
    price: 160,
    active: true
  },
  {
    id: 'CGOT3',
    dateAndTime: '2021-08-01T08:30',
    route: 'CGOR3',
    stock: 11,
    passengers: [
      {
        id: 'CGOU3',
        legalStatus: LEGAL_STATUS.APPROVED,
        bookingStatus: BOOKING_STATES.COMPLETED,
        creditCard: '4444444444444444',
        payment: 200,
        boughtAdditionals: [],
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV1',
    status: TRAVEL_STATES.FINISHED,
    availableAdditionals: [
      'CGOA2',
      'CGOA4',
      'CGOA5'
    ],
    price: 200,
    active: true
  },
  {
    id: 'CGOT4',
    dateAndTime: '2021-06-09T09:00',
    route: 'CGOR4',
    stock: 11,
    passengers: [
      {
        id: 'CGOU3',
        legalStatus: LEGAL_STATUS.APPROVED,
        bookingStatus: BOOKING_STATES.ACTIVE,
        creditCard: '4444444444444444',
        payment: 120,
        boughtAdditionals: [],
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV1',
    status: TRAVEL_STATES.IN_PROGRESS,
    availableAdditionals: [
      'CGOA2',
      'CGOA4',
      'CGOA5'
    ],
    price: 120,
    active: true
  }
];

let additionals = [
  {
    id: 'CGOA1',
    name: 'Caja de 8 chicles de frutilla Beldent',
    price: 50,
    sold: false,
    active: true
  },
  {
    id: 'CGOA2',
    name: 'Caja de 6 alfajores Jorgito',
    price: 500,
    sold: false,
    active: true
  },
  { 
    id: 'CGOA3',
    name: 'Caja de 6 conitos Havana',
    price: 200,
    sold: true,
    active: true
  },
  { 
    id: 'CGOA4',
    name: 'Botella 200ml de Pepsi',
    price: 120,
    sold: true,
    active: true
  },
  { 
    id: 'CGOA5',
    name: 'Botella 200ml de Coca Cola',
    price: 125,
    sold: true,
    active: true
  },
  { 
    id: 'CGOA6',
    name: 'Botella 200ml de Manaos',
    price: 100,
    sold: true,
    active: false
  }
];

// lista de userIds alguna vez rechazados
let blacklist = [];

module.exports = {users, vehicles, additionals, routes, travels, blacklist};