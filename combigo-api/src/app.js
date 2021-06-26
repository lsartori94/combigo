const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mailer = require('./api/mailer/mailer');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

mailer.init();

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

// Rutas demo mailer

app.get('/demo/mailer/activation', (req, res) => {
  mailer.sendActivationEmail('test@test.com');
  res.json({
    message: 'MAILER DEMO WOOOO ====> Activacion de cuenta'
  });
})

app.get('/demo/mailer/tripCancelation', (req, res) => {
  mailer.sendTripCancelationEmail(
    'test@test.com',
    "La Plata", //viaje origen
    "Buenos Aires", //viaje destino
    "2021-06-09", //viaje fecha
    "09:00" //viaje hora
  );
  res.json({
    message: 'MAILER DEMO WOOOO ====> Viaje cancelado por admin ====> Mira la consola para tener la URL del mensaje'
  });
})

app.get('/demo/mailer/vipStart', (req, res) => {
  mailer.vipSubscriptionInitiatedEmail(
    'test@test.com'
  );
  res.json({
    message: 'MAILER DEMO WOOOO ====> Subscripcion VIP ====> Mira la consola para tener la URL del mensaje'
  });
})

app.get('/demo/mailer/vipEnd', (req, res) => {
  mailer.vipSubscriptionEndedEmail(
    'test@test.com'
  );
  res.json({
    message: 'MAILER DEMO WOOOO ====> Desubscripcion VIP ====> Mira la consola para tener la URL del mensaje'
  });
})

app.get('/demo/mailer/bookingConfirmed', (req, res) => {
  mailer.sendBookingConfirmationEmail(
    'test@test.com',
    "La Plata", //viaje origen
    "Buenos Aires", //viaje destino
    "2021-06-09", //viaje fecha
    "09:00" //viaje hora
  );
  res.json({
    message: 'MAILER DEMO WOOOO ====> Reserva Confirmada ====> Mira la consola para tener la URL del mensaje'
  });
})

app.get('/demo/mailer/bookingCanceled', (req, res) => {
  mailer.sendBookingCancelationEmail(
    'test@test.com',
    "La Plata", //viaje origen
    "Buenos Aires", //viaje destino
    "2021-06-09", //viaje fecha
    "09:00", //viaje hora,
    "50%" //porcentaje de reintegro
  );
  res.json({
    message: 'MAILER DEMO WOOOO ====> Reserva cancelada por el usuario ====> Mira la consola para tener la URL del mensaje'
  });
})

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
