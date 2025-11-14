const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const umaMusumesRoutes = require('./uma_musumes');

router.use('/auth', authRoutes);
router.use('/uma_musumes', umaMusumesRoutes);

module.exports = router;
