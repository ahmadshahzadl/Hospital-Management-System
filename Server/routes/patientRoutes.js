const express = require('express');
const PatientController = require('../controllers/PatientController');
const AuthMiddleware = require('../middleware/auth');

class PatientRoutes {
    constructor() {
        this.router = express.Router();
        this.patientController = new PatientController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['admin', 'doctor']), 
            this.patientController.getAllPatients
        );
        
        this.router.get('/:id', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['admin', 'doctor']), 
            this.patientController.getPatientById
        );
        
        this.router.put('/profile', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['patient']), 
            this.patientController.updatePatient
        );
        
        this.router.post('/medical-history', 
            AuthMiddleware.authenticate, 
            AuthMiddleware.authorize(['patient']), 
            this.patientController.addMedicalHistory
        );
    }
}

module.exports = PatientRoutes;