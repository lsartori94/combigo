const express = require('express');

const emojis = require('./emojis');

const vehicles = require('./vehicles');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/vehicles', vehicles);

module.exports = router;
