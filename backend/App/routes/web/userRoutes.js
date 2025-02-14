const express = require("express");
const { signup, login, findUser, verifyEmail, resetPassword, createPrescription, prescriptionList, patientsList, doctorProfile, updateProfile, addProfile, qrcodeFunc, qrcodeforPatient, prescriptionListforPatient, getRemindersByPatient, updateReminder } = require('../../controller/web/userController.js');
const authMiddleware = require('../../../Config/authMiddleware.js');
const authPatientMiddleware = require('../../../Config/authPatientMiddleware.js');
let routes = express.Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.get('/doctor', findUser);
routes.get('/patient', findUser);
routes.post('/verify-email', verifyEmail);
routes.post('/reset-password', resetPassword);
routes.post('/create-prescription', authMiddleware, createPrescription);
routes.get('/prescriptions', prescriptionList);
routes.get('/patients', authMiddleware, patientsList);
routes.get('/profile', doctorProfile);
routes.put('/profile', authMiddleware, updateProfile);
routes.post('/profile', authMiddleware, addProfile);
routes.get('/qrcode', authMiddleware, qrcodeFunc);
routes.get('/latest-qr', authPatientMiddleware, qrcodeforPatient);
routes.get('/patient-prescription', authPatientMiddleware, prescriptionListforPatient);
routes.get('/reminders', authPatientMiddleware, getRemindersByPatient);
routes.put('/update-reminder', authPatientMiddleware, updateReminder);

// Example protected route (Doctor's Dashboard)
routes.get("/doctor-dashboard", authMiddleware, (req, res) => {
    // Only authenticated users can access this route
    res.json({ message: "Welcome to the Doctor's Dashboard!", user: req.user });
});

module.exports = { routes };
