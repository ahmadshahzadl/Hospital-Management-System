const mongoose = require('mongoose');

class AppointmentSchema {
    constructor() {
        this.schema = new mongoose.Schema({
            patientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient',
                required: true
            },
            doctorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Doctor',
                required: true
            },
            appointmentDate: {
                type: Date,
                required: true
            },
            appointmentTime: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['scheduled', 'completed', 'cancelled'],
                default: 'scheduled'
            },
            reason: {
                type: String,
                required: true
            },
            notes: {
                type: String
            }
        }, { timestamps: true });
    }

    getModel() {
        return mongoose.model('Appointment', this.schema);
    }
}

module.exports = new AppointmentSchema().getModel();