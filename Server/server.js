require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DatabaseConnection = require('./config/database');
const AuthRoutes = require('./routes/authRoutes');
const DoctorRoutes = require('./routes/doctorRoutes');
const PatientRoutes = require('./routes/patientRoutes');
const AppointmentRoutes = require('./routes/appointmentRoutes');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.database = new DatabaseConnection();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    initializeRoutes() {
        this.app.use('/api/auth', new AuthRoutes().router);
        this.app.use('/api/doctors', new DoctorRoutes().router);
        this.app.use('/api/patients', new PatientRoutes().router);
        this.app.use('/api/appointments', new AppointmentRoutes().router);
    }

    async start() {
        try {
            await this.database.connect();
            this.app.listen(this.port, () => {
                console.log(`Server running on port ${this.port}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
        }
    }
}

const server = new Server();
server.start();