const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    }, // Patient's full name
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Email validation
    }, // Patient's email (unique identifier)

    contactNumber: { 
        type: String, 
        required: true,
        match: /^\d{10,15}$/ // Ensures only digits (10-15 digits)
    }, // Patient's contact number

    paymentInfo: { // Payment details stored inside a nested object
        cardNumber: { 
            type: String, 
            required: true,
            match: /^\d{16}$/ // Ensures only 16-digit card numbers
        },
        expiryDate: { 
            type: String, 
            required: true,
            match: /^(0[1-9]|1[0-2])\/\d{2}$/ // Ensures MM/YY format
        },
        cvv: { 
            type: String, 
            required: true,
            match: /^\d{3,4}$/ // Ensures 3 or 4 digits (CVV)
        },
        billingAddress: { 
            type: String, 
            default: "" 
        } // Patient's billing address
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // Timestamp of when the profile was created

    updatedAt: { 
        type: Date, 
        default: Date.now 
    } // Timestamp of last update
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
