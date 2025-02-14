const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    prescriptionId: { 
        type: String, 
        unique: true 
    },
    doctorEmail: { 
        type: String, 
        required: true 
    }, // Link to the doctor
    patientName: {
        type: String,
        required: true
    },
    patientEmail: { 
        type: String, 
        required: true 
    }, // Link to the patient
    medicines: { 
        type: String, 
        required: true 
    },
    schedule: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;