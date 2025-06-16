const Patient = require('../models/Patient');
const User = require('../models/User');

class PatientController {
    async getAllPatients(req, res) {
        try {
            const patients = await Patient.find().populate('userId', 'firstName lastName email');
            res.json({ patients });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPatientById(req, res) {
        try {
            const patient = await Patient.findById(req.params.id).populate('userId', 'firstName lastName email');
            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json({ patient });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updatePatient(req, res) {
        try {
            const patient = await Patient.findOneAndUpdate(
                { userId: req.user._id },
                req.body,
                { new: true }
            ).populate('userId', 'firstName lastName email');

            if (!patient) {
                return res.status(404).json({ error: 'Patient profile not found' });
            }

            res.json({ message: 'Patient profile updated', patient });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addMedicalHistory(req, res) {
        try {
            const patient = await Patient.findOne({ userId: req.user._id });
            if (!patient) {
                return res.status(404).json({ error: 'Patient profile not found' });
            }

            patient.medicalHistory.push(req.body);
            await patient.save();

            res.json({ message: 'Medical history added', patient });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PatientController;