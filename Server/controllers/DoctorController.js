const Doctor = require('../models/Doctor');
const User = require('../models/User');

class DoctorController {
    async getAllDoctors(req, res) {
        try {
            const doctors = await Doctor.find().populate('userId', 'firstName lastName email');
            res.json({ doctors });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDoctorById(req, res) {
        try {
            const doctor = await Doctor.findById(req.params.id).populate('userId', 'firstName lastName email');
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json({ doctor });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateDoctor(req, res) {
        try {
            const doctor = await Doctor.findOneAndUpdate(
                { userId: req.user._id },
                req.body,
                { new: true }
            ).populate('userId', 'firstName lastName email');

            if (!doctor) {
                return res.status(404).json({ error: 'Doctor profile not found' });
            }

            res.json({ message: 'Doctor profile updated', doctor });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDoctorsBySpecialization(req, res) {
        try {
            const { specialization } = req.params;
            const doctors = await Doctor.find({ 
                specialization: new RegExp(specialization, 'i') 
            }).populate('userId', 'firstName lastName email');
            
            res.json({ doctors });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DoctorController;