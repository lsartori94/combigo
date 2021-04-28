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

module.exports = {users, vehicles};