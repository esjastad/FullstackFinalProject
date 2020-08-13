const express = require('express');
const router = express.Router();
const db = require('../queryDB')

// GET titles Ex endpoint: http://localhost:5000/titles
router.get('/', db.getTitles)

module.exports = router;