const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

class AuthController {
    async signup(req, res) {
        try {
            const { username, email, password, role, firstName, lastName, ...additionalData } = req.body;

            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const user = new User({
                username,
                email,
                password,
                role,
                firstName,
                lastName
            });

            await user.save();

            if (role === 'doctor') {
                const doctor = new Doctor({
                    userId: user._id,
                    ...additionalData
                });
                await doctor.save();
            } else if (role === 'patient') {
                const patient = new Patient({
                    userId: user._id,
                    ...additionalData
                });
                await patient.save();
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            let profile = req.user;

            if (req.user.role === 'doctor') {
                const doctorProfile = await Doctor.findOne({ userId: req.user._id });
                profile = { ...req.user.toObject(), doctorDetails: doctorProfile };
            } else if (req.user.role === 'patient') {
                const patientProfile = await Patient.findOne({ userId: req.user._id });
                profile = { ...req.user.toObject(), patientDetails: patientProfile };
            }

            res.json({ profile });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AuthController;