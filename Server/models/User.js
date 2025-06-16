const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class UserSchema {
    constructor() {
        this.schema = new mongoose.Schema({
            username: {
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            role: {
                type: String,
                enum: ['admin', 'doctor', 'patient'],
                default: 'patient'
            },
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            }
        }, { timestamps: true });

        this.schema.pre('save', async function(next) {
            if (!this.isModified('password')) return next();
            this.password = await bcrypt.hash(this.password, 10);
            next();
        });

        this.schema.methods.comparePassword = async function(password) {
            return await bcrypt.compare(password, this.password);
        };
    }

    getModel() {
        return mongoose.model('User', this.schema);
    }
}

module.exports = new UserSchema().getModel();