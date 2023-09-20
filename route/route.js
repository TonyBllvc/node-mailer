const { signup, getbill } = require('../controller/appController');

const router = require('express').Router();  

/** HTTP Reqeust */
router.post('/user/signup', signup);
router.post('/product/getbill', getbill);


module.exports = router;