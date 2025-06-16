const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middleware/auth');

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/signup', this.authController.signup);
        this.router.post('/login', this.authController.login);
        this.router.get('/profile', AuthMiddleware.authenticate, this.authController.getProfile);
    }
}

module.exports = AuthRoutes;