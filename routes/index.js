const express = require('express');
const router = express.Router();

router.use('/lifo', require('./lifo'));
router.use('/memo', require('./keyval'));

module.exports = router;
