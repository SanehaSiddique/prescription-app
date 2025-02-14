const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, // Doctor's email (used as a unique identifier)
    name: { 
        type: String, 
        required: true 
    }, // Doctor's full name
    specialization: { 
        type: String, 
        required: true 
    }, // Doctor's specialization
    hospital: { 
        type: String, 
        required: true 
    }, // Hospital or clinic name
    contactNumber: { 
        type: String, 
        required: true 
    }, // Contact number
    bio: { 
        type: String, 
        default: "" 
    }, // Short bio or description
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // Timestamp of when the profile was created
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }, // Timestamp of when the profile was last updated
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;