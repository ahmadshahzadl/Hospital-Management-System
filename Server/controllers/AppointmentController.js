const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

class AppointmentController {
    async createAppointment(req, res) {
        try {
            const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
            
            const patient = await Patient.findOne({ userId: req.user._id });
            if (!patient) {
                return res.status(404).json({ error: 'Patient profile not found' });
            }

            const appointment = new Appointment({
                patientId: patient._id,
                doctorId,
                appointmentDate,
                appointmentTime,
                reason
            });

            await appointment.save();
            
            const populatedAppointment = await Appointment.findById(appointment._id)
                .populate({
                    path: 'patientId',
                    populate: { path: 'userId', select: 'firstName lastName email' }
                })
                .populate({
                    path: 'doctorId',
                    populate: { path: 'userId', select: 'firstName lastName email' }
                });

            res.status(201).json({ 
                message: 'Appointment created successfully', 
                appointment: populatedAppointment 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAppointments(req, res) {
        try {
            let query = {};
            
            if (req.user.role === 'patient') {
                const patient = await Patient.findOne({ userId: req.user._id });
                query.patientId = patient._id;
            } else if (req.user.role === 'doctor') {
                const doctor = await Doctor.findOne({ userId: req.user._id });
                query.doctorId = doctor._id;
            }

            const appointments = await Appointment.find(query)
                .populate({
                    path: 'patientId',
                    populate: { path: 'userId', select: 'firstName lastName email' }
                })
                .populate({
                    path: 'doctorId',
                    populate: { path: 'userId', select: 'firstName lastName email' }
                })
                .sort({ appointmentDate: 1 });

            res.json({ appointments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateAppointmentStatus(req, res) {
        try {
            const { status, notes } = req.body;
            const appointment = await Appointment.findByIdAndUpdate(
                req.params.id,
                { status, notes },
                { new: true }
            ).populate({
                path: 'patientId',
                populate: { path: 'userId', select: 'firstName lastName email' }
            }).populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'firstName lastName email' }
            });

            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }

            res.json({ message: 'Appointment updated', appointment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAppointment(req, res) {
        try {
            const appointment = await Appointment.findByIdAndDelete(req.params.id);
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json({ message: 'Appointment cancelled successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AppointmentController;