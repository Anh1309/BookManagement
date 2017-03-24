const express = require('express');
const router = express.Router();
const path = require('path');
const authRoute = require('./AuthRoute');
const bookRoute = require('./BookRoute');
const categoryRoute = require('./CategoryRoute');
const userRoute = require('./UserRoute');

//router.get('/', function(req, res) {
//    res.sendFile(path.resolve(__dirname, '../../public/views/auth', 'login.html'));
//});

router.use('/auth', authRoute);
router.use('/book', bookRoute);
router.use('/category', categoryRoute);
router.use('/user', userRoute);


module.exports = router;
