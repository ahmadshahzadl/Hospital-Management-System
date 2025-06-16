const express = require('express');
const AppointmentController = require('../controllers/AppointmentController');
const AuthMiddleware = require('../middleware/auth');

class AppointmentRoutes {
    constructor() {
        this.router = express.Router();
        this.appointmentController = new AppointmentController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['patient']), 
            this.appointmentController.createAppointment
        );
        
        this.router.get('/', 
            AuthMiddleware.authenticate, 
            this.appointmentController.getAppointments
        );
        
        this.router.put('/:id', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['doctor', 'admin']), 
            this.appointmentController.updateAppointmentStatus
        );
        
        this.router.delete('/:id', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['patient', 'doctor', 'admin']), 
            this.appointmentController.deleteAppointment
        );
    }
}

module.exports = AppointmentRoutes;