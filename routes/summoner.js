const express = require('express');
const router = express.Router();
const { getSummoner } = require('../controllers/summoner');

router.get('/summoner', getSummoner);

module.exports = router;
