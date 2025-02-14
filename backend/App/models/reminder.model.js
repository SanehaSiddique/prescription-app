const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  patientEmail: {
    type: String,
    required: true, // Email of the patient to whom the reminder belongs
  },
  medicine: {
    type: String,
    required: true, // Name of the medicine
  },
  dosage: {
    type: String,
    required: true, // Dosage information (e.g., "2 tablets", "1 dose")
  },
  status: {
    type: String,
    enum: ["Pending", "Taken"], // Track if the reminder is still pending, has been taken
    default: "Pending", // Initial status is "Pending"
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription", // Reference to the prescription from which this reminder was created
  },
  createdAt: {
    type: Date,
    default: Date.now, // When the reminder was created
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
