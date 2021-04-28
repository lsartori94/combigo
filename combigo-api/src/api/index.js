const express = require('express');

const emojis = require('./emojis');

const vehicles = require('./vehicles');
const users = require('./users');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);

router.use('/vehicles', vehicles);
router.use('/users', users);

module.exports = router;
