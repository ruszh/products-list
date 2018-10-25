const express = require('express');
const router = express.Router();

const signup = require('../authentication/signup');
const signin = require('../authentication/signin');

router.post('/signup', signup);

router.post('/signin', signin);

module.exports = router;