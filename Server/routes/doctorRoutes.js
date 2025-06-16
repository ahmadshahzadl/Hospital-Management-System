const express = require('express');
const DoctorController = require('../controllers/DoctorController');
const AuthMiddleware = require('../middleware/auth');

class DoctorRoutes {
    constructor() {
        this.router = express.Router();
        this.doctorController = new DoctorController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/', this.doctorController.getAllDoctors);
        this.router.get('/:id', this.doctorController.getDoctorById);
        this.router.get('/specialization/:specialization', this.doctorController.getDoctorsBySpecialization);
        
        this.router.put('/profile', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['doctor']), 
            this.doctorController.updateDoctor
        );
    }
}

module.exports = DoctorRoutes;