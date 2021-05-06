const express = require('express');

const emojis = require('./emojis');
const vehicles = require('./vehicles');
const users = require('./users');
const additionals = require('./additionals');
const routes = require('./routes');
const travels = require('./travels');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);

router.use('/users', users);
router.use('/vehicles', vehicles);
router.use('/additionals', additionals);
router.use('/routes', routes);
router.use('/travels', travels);

module.exports = router;
