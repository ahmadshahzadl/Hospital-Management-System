const mongoose = require('mongoose');

class DoctorSchema {
    constructor() {
        this.schema = new mongoose.Schema({
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            specialization: {
                type: String,
                required: true
            },
            qualification: {
                type: String,
                required: true
            },
            experience: {
                type: Number,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            schedule: [{
                day: {
                    type: String,
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                },
                startTime: String,
                endTime: String
            }]
        }, { timestamps: true });
    }

    getModel() {
        return mongoose.model('Doctor', this.schema);
    }
}

module.exports = new DoctorSchema().getModel();