const mongoose = require('mongoose');

class DatabaseConnection {
    constructor() {
        this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_db';
    }

    async connect() {
        try {
            await mongoose.connect(this.uri);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Database disconnection failed:', error);
        }
    }
}

module.exports = DatabaseConnection;