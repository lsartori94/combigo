const { ROLES, TRAVEL_STATES, BOOKING_STATES, LEGAL_STATUS, VIP_STATUS } = require('./constants');

let users = [
  { //ADMIN
    id: 'CGOU0',
    username: 'admin',
    email: 'admin',
    name: 'Admin',
    password: 'admin',
    bdate: '', 
    role: ROLES.ADMIN,
    active: true
  },
  { //DRIVERS
    id: 'CGOU1',
    username: 'jose.traffic',
    email: 'joset@gmail.com',
    name: 'Jose',
    password: '123@Pass',
    bdate: '1962-12-12',
    dni: '34406758',
    completedTravels: [],
    role: ROLES.DRIVER,
    active: true
  },
  {
    id: 'CGOU2',
    username: 'manuel.benz',
    email: 'manuelb@gmail.com',
    name: 'Manuel',
    password: '123@Pass',
    bdate: '1981-10-20',
    dni: '38516758',
    completedTravels: [],
    role: ROLES.DRIVER,
    active: true
  },
  {
    id: 'CGOU3',
    username: 'jorge.volvo',
    email: 'jorgev@gmail.com',
    name: 'Jorge',
    password: '123@Pass',
    bdate: '1974-6-10',
    dni: '36194680',
    completedTravels: [],
    role: ROLES.DRIVER,
    active: true
  },
  {
    id: 'CGOU4',
    username: 'raul.volvo',
    email: 'raulv@gmail.com',
    name: 'Raul',
    password: '123@Pass',
    bdate: '1972-11-12',
    dni: '35678778',
    completedTravels: [],
    role: ROLES.DRIVER,
    active: true
  },
  { //CLIENTS
    id: 'CGOU5',
    username: 'juan.perez',
    email: 'juanp@gmail.com',
    name: 'Juan',
    password: '123@Pass',
    bdate: '1990-11-12',
    dni: '37502385',
    travelHistory: [
      {
        travelId: 'CGOT3',
        bookingId: 'CGOB0',
        legalStatus: LEGAL_STATUS.REJECTED,
        boughtAdditionals: [],
        status: BOOKING_STATES.CANCELED,
        payment: 200
      },
    ], 
    creditCard: {
      issuer: 'Visa',
      number: '4983794057102007',
      cardHolder: 'Juan Perez',
      expDate: '2021-10-10',
      cvv:'123'
    },
    vip: {
      status: VIP_STATUS.NOT_ENROLLED,
      startDate: ''
    },
    role: ROLES.CLIENT,
    active: true,
    registerDate: '2021-04-01T12:24:00'
  },
  {
    id: 'CGOU6',
    username: 'diego.sosa',
    email: 'diegos@gmail.com',
    name: 'Diego',
    password: '123@Pass',
    bdate: '1995-10-12',
    dni: '42357195',
    travelHistory: [
      {
        travelId: 'CGOT1',
        bookingId: 'CGOB0',
        legalStatus: LEGAL_STATUS.APPROVED,
        boughtAdditionals: [ 
          'CGOA1',
          'CGOA3',
        ],
        status: BOOKING_STATES.COMPLETED,
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
        legalStatus: LEGAL_STATUS.PENDING,
        boughtAdditionals: [],
        status: BOOKING_STATES.PENDING,
        payment: 120
      }
    ],
    creditCard: {},
    vip: {
      status: VIP_STATUS.NOT_ENROLLED,
      startDate: ''
    },
    role: ROLES.CLIENT,
    active: true,
    registerDate: '2021-01-20T14:30:00'
  },
  {
    id: 'CGOU7',
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
    vip: {
      status: VIP_STATUS.ENROLLED,
      startDate: '2021-04-25T09:08:00'
    },
    role: ROLES.CLIENT,
    active: true,
    registerDate: '2021-04-20T09:12:00'
  },
  {
    id: 'CGOU8',
    username: 'mario.kempes',
    email: 'mariok@gmail.com',
    name: 'Mario',
    password: '123@Pass',
    bdate: '1986-06-06',
    dni: '32744452',
    travelHistory: [], 
    creditCard: {
      issuer: 'Visa',
      number: '4444555566667777',
      cardHolder: 'Carlos Lopez',
      expDate: '2022-11-12',
      cvv:'153'
    },
    vip: {
      status: VIP_STATUS.NOT_ENROLLED,
      startDate: ''
    },
    role: ROLES.CLIENT,
    active: true,
    registerDate: '2021-06-20T09:12:00'
  }
  //END CLIENTS
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
      'CGOT1',
      'CGOT5'
    ],
    active: true
  },
  {
    id: 'CGOR2',
    origin: 'Buenos Aires',
    destination: 'Cordoba',
    distanceKm: 600,
    durationMin: 400,
    travels: [
      'CGOT6',
      'CGOT7',
      'CGOT9'
    ],
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
      'CGOT4',
      'CGOT8'
    ],
    active: true
  }
];

let travels = [
  {
    id: 'CGOT1',
    dateAndTime: '2021-05-10T22:40',
    route: 'CGOR1',
    stock: 1,
    passengers: [
      {
        id: 'CGOU6',
        ticketId: 'CGOTKT1',
        legalStatus: LEGAL_STATUS.APPROVED,
        bookingStatus: BOOKING_STATES.COMPLETED,
        creditCard: '4444444444444444',
        payment: 350,
        boughtAdditionals: [
          'CGOA1',
          'CGOA3',
        ],
        accepted: true,
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV4',
    status: TRAVEL_STATES.FINISHED,
    availableAdditionals: [
      'CGOA1',
      'CGOA3'
    ],
    price: 100,
    active: true
  },
  {
    id: 'CGOT2',
    dateAndTime: '2021-06-01T09:00',
    route: 'CGOR3',
    stock: 9,
    passengers: [
      {
        id: 'CGOU6',
        ticketId: 'CGOTKT1',
        legalStatus: LEGAL_STATUS.APPROVED,
        bookingStatus: BOOKING_STATES.COMPLETED,
        creditCard: '4444444444444444',
        payment: 160,
        boughtAdditionals: [],
        accepted: true,
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
    dateAndTime: '2021-06-05T08:30',
    route: 'CGOR3',
    stock: 11,
    passengers: [
      {
        id: 'CGOU6',
        ticketId: 'CGOTKT1',
        legalStatus: LEGAL_STATUS.APPROVED,
        bookingStatus: BOOKING_STATES.COMPLETED,
        creditCard: '4444444444444444',
        payment: 200,
        boughtAdditionals: [],
        accepted: true,
      },
      {
        id: 'CGOU5',
        ticketId: 'CGOTKT2',
        legalStatus: LEGAL_STATUS.REJECTED,
        bookingStatus: BOOKING_STATES.CANCELED,
        creditCard: '5555555555555555',
        payment: 200,
        boughtAdditionals: [],
        accepted: false,
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
    dateAndTime: '2021-07-01T09:20', //----------------------------------------------> 07-01
    route: 'CGOR4',
    stock: 11,
    passengers: [
      {
        id: 'CGOU6',
        ticketId: 'CGOTKT1',
        legalStatus: LEGAL_STATUS.PENDING,
        bookingStatus: BOOKING_STATES.PENDING,
        creditCard: '4444444444444444',
        payment: 120,
        boughtAdditionals: [],
        accepted: false,
      }
    ],
    driver: 'CGOU1',
    vehicle: 'CGOV1',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      'CGOA2',
      'CGOA4',
      'CGOA5'
    ],
    price: 120,
    active: true
  },
  {
    id: 'CGOT6',
    dateAndTime: '2021-07-02T12:00',
    route: 'CGOR2',
    stock: 20,
    passengers: [],
    driver: 'CGOU3',
    vehicle: 'CGOV3',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      'CGOA1'
    ],
    price: 400,
    active: true
  },
  {
    id: 'CGOT7',
    dateAndTime: '2021-07-04T15:00',
    route: 'CGOR2',
    stock: 20,
    passengers: [],
    driver: 'CGOU3',
    vehicle: 'CGOV3',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      'CGOA1'
    ],
    price: 400,
    active: true
  },
  {
    id: 'CGOT5',
    dateAndTime: '2021-07-08T10:20',
    route: 'CGOR1',
    stock: 2,
    passengers: [],
    driver: 'CGOU1',
    vehicle: 'CGOV4',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [],
    price: 100,
    active: true
  },
  {
    id: 'CGOT8',
    dateAndTime: '2021-07-11T12:00',
    route: 'CGOR4',
    stock: 20,
    passengers: [],
    driver: 'CGOU2',
    vehicle: 'CGOV3',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      'CGOA1',
      'CGOA3'
    ],
    price: 400,
    active: true
  },
  {
    id: 'CGOT9',
    dateAndTime: '2021-08-20T14:00',
    route: 'CGOR2',
    stock: 20,
    passengers: [],
    driver: 'CGOU3',
    vehicle: 'CGOV3',
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: [
      'CGOA1'
    ],
    price: 400,
    active: true
  },
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

// lista de users rechazados
let blacklist = [
  {
    userId: 'CGOU5',
    startDate: '2021-06-05T08:10',
    endDate: '2021-06-20T08:10',
    history: []
  }
];

module.exports = {users, vehicles, additionals, routes, travels, blacklist};