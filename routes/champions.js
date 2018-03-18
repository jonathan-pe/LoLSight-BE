const express = require('express');
const router = express.Router();
const { getChampions, getChampion } = require('../controllers/champions');

router.get('/champions', getChampions);
router.get('/champions/:champName', getChampion);

module.exports = router;
