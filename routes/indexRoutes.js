const express = require('express')
router = express.Router();

router.use('/user', require('./web/userRoutes'))

module.exports = router;