const express = require('express');

const authRouter = express.Router();

const {UserRegister , StudentLogin , InstructorLogin} = require('../controllers/auth.js');

authRouter.post('/register',UserRegister)
authRouter.post('/studentlogin',StudentLogin)
authRouter.post('/instructorlogin',InstructorLogin)

module.exports = authRouter;