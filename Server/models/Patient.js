const mongoose = require('mongoose');

class PatientSchema {
    constructor() {
        this.schema = new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            dateOfBirth: {
                type: Date,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            emergencyContact: {
                name: String,
                phone: String,
                relation: String
            },
            medicalHistory: [{
                condition: String,
                date: Date,
                notes: String
            }]
        }, { timestamps: true });
    }

    getModel() {
        return mongoose.model('Patient', this.schema);
    }
}

module.exports = new PatientSchema().getModel();