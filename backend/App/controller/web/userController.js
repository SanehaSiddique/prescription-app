let User = require('../../models/user.model.js');
const validator = require('validator');
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { username, email, password, userType } = req.body; // Extract from body
    // const { userType } = req.query; // Extract from query parameters

    // Validate input
    if (!email || !password || !userType || !username) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validator.isLength(username, { min: 3, max: 20 })) {
        return res.status(400).json({ message: "Username must be between 3 to 20 characters long." });
    }

    // Validate password security
    // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //     return res.status(400).json({ 
    //         message: "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character." 
    //     });
    // }
    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long."
        });
    }
    else {
        console.log('Password is valid');
    }

    // Check if userType is valid
    if (!["patient", "doctor"].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type." });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Check if the username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already taken." });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password,
            userType,
        });

        // Save the user to the database
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, userType: newUser.userType }, // Include userType in payload
            process.env.JWT_SECRET, // Use a secret key from environment variables
            { algorithm: "HS384", expiresIn: "1h" }
        );

        // Respond with success
        res.status(201).json({ message: "Signup successful!", user: newUser, token });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ message: "Signup failed. Try again." });
    }
};

const bcrypt = require("bcrypt");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate JWT token (including userType)
        const token = jwt.sign(
            { id: user._id, email: user.email, userType: user.userType }, // Include userType in payload
            process.env.JWT_SECRET, // Use a secret key from environment variables
            { algorithm: "HS384", expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                userType: user.userType, // Useful for frontend role-based UI
            },
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Login failed. Try again." });
    }
};

const findUser = async (req, res) => {
    try {
        const { email } = req.query;
        const doctor = await User.findOne({ email });
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ error: "Not found" });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "server error" });
    }
};

const verifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Email verified." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        const result = await User.updateOne(
            { email }, // Find the user by email
            { $set: { password: hashedPassword } } // Update the password field
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const Prescription = require('../../models/prescription.model.js');
const { v4: uuidv4 } = require('uuid');

// Assuming Prescription schema in the backend contains a `patientUsername` field
const prescriptionList = async (req, res) => {
    try {
        const { doctorEmail } = req.query;

        if (!doctorEmail) {
            return res.status(400).json({ message: 'Doctor email is required' });
        }

        // Fetch prescriptions based on doctorEmail
        const prescriptions = await Prescription.find({ doctorEmail });

        // Return prescriptions with patientUsername
        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const patientsList = async (req, res) => {
    try {
        const { doctorEmail } = req.query;

        // Validate if doctorEmail is provided
        if (!doctorEmail) {
            return res.status(400).json({ message: 'Doctor email is required' });
        }

        // Fetch all prescriptions for the specific doctor
        const prescriptions = await Prescription.find({ doctorEmail });

        // Extract unique patient emails
        const uniquePatientsEmails = [...new Set(prescriptions.map(p => p.patientEmail))];

        // Create an array to store patient details
        const patients = [];

        // For each unique patient, fetch their details from prescriptions
        for (const email of uniquePatientsEmails) {
            // Find the latest prescription for this patient
            const patientPrescriptions = prescriptions.filter(p => p.patientEmail === email);
            const latestPrescription = patientPrescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]; // Sorting to get the latest

            // Add patient details (name, email, last dealt date)
            patients.push({
                name: latestPrescription.patientName,
                email: email,
                lastDealtDate: latestPrescription.createdAt.toISOString().split('T')[0], // Formatting date (YYYY-MM-DD)
            });
        }

        // Return the total number of unique patients and the list of patient details
        res.status(200).json({
            totalPatients: patients.length,
            patients: patients,
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const Doctor = require('../../models/doctor.model.js');

// Fetch doctor's profile
const doctorProfile = async (req, res) => {
    try {
        const { email } = req.query; // Make sure the email is sent as a query parameter

        // Validate if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Doctor email is required' });
        }

        // Fetch doctor's information
        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error fetching doctor information:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update doctor's profile
const updateProfile = async (req, res) => {
    try {
        const { email } = req.query;
        const updateData = req.body;

        // Validate if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Doctor email is required' });
        }

        // Update doctor's information
        const updatedDoctor = await Doctor.findOneAndUpdate(
            { email },
            { $set: updateData, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor information:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add new doctor profile
const addProfile = async (req, res) => {
    try {
        const { email, name, specialization, hospital, contactNumber, bio } = req.body;

        // Validate required fields
        if (!email || !name || !specialization || !hospital || !contactNumber) {
            return res.status(400).json({ message: 'All fields are required except bio' });
        }

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor profile already exists' });
        }

        // Create a new doctor profile
        const newDoctor = new Doctor({
            email,
            name,
            specialization,
            hospital,
            contactNumber,
            bio: bio || "",
        });

        await newDoctor.save();

        res.status(201).json(newDoctor);
    } catch (error) {
        console.error('Error creating doctor profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const QRCode = require('qrcode');

const qrcodeFunc = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate if prescriptionId is provided
        if (!id) {
            return res.status(400).json({ message: 'Prescription ID is required' });
        }

        // Fetch prescription details from the database
        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Create a JSON object with all prescription details
        const qrData = JSON.stringify({
            doctorEmail: prescription.doctorEmail,
            patientEmail: prescription.patientEmail,
            medicines: prescription.medicines,
            schedule: prescription.schedule,
        });

        // Generate QR code
        const qrCodeImage = await QRCode.toDataURL(qrData);

        res.status(200).json({ qrCodeImage });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const qrcodeforPatient = async (req, res) => {
    try {
        const { patientEmail } = req.query;

        if (!patientEmail) {
            return res.status(400).json({ message: "Patient email is required." });
        }

        // Find the latest prescription for the patient
        const latestPrescription = await Prescription.findOne({ patientEmail })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .exec();

        if (!latestPrescription) {
            return res.status(404).json({ message: "No prescription found for this patient." });
        }

        const qrData = JSON.stringify({
            doctorEmail: latestPrescription.doctorEmail,
            patientEmail: latestPrescription.patientEmail,
            medicines: latestPrescription.medicines,
            schedule: latestPrescription.schedule,
        });

        // Generate QR code for the prescription
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        res.status(200).json({ qrCodeUrl });
    } catch (err) {
        console.error("Error fetching QR code:", err);
        res.status(500).json({ message: "Failed to fetch QR code." });
    }
};

const prescriptionListforPatient = async (req, res) => {
    try {
        const { patientEmail } = req.query;

        if (!patientEmail) {
            return res.status(400).json({ message: 'Patient email is required' });
        }

        const prescriptions = await Prescription.find({ patientEmail });

        // Return prescriptions with patientUsername
        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const Reminder = require("../../models/reminder.model.js");

const createRemindersFromPrescription = async (patientEmail) => {
    try {
        // Fetch the latest prescription for the patient
        const prescription = await Prescription.findOne({ patientEmail }).sort({ createdAt: -1 });

        if (!prescription) {
            throw new Error("No prescription found for the patient.");
        }

        // Split medicines and schedules into arrays
        const medicineList = prescription.medicines.split(",").map((m) => m.trim());
        const scheduleList = prescription.schedule.split(",").map((d) => d.trim());

        // Ensure all arrays have the same length
        if (medicineList.length !== scheduleList.length) {
            throw new Error("Mismatch in medicines or schedules.");
        }

        // Create a reminder for each medicine
        for (let i = 0; i < medicineList.length; i++) {
            const reminder = new Reminder({
                patientEmail: prescription.patientEmail,
                medicine: medicineList[i], // Use singular `medicine` as per schema
                dosage: scheduleList[i], // Use `dosage` as per schema
                prescriptionId: prescription._id, // Use the ObjectId of the prescription
            });

            await reminder.save();
            console.log(`Reminder for ${medicineList[i]} created for ${prescription.patientEmail}`);
        }
    } catch (error) {
        console.error("Error creating reminders:", error);
    }
};

const createPrescription = async (req, res) => {
    const { doctorEmail, patientName, patientEmail, medicines, schedule } = req.body;

    try {
        // Check if the doctor and patient exist in the users schema
        const doctor = await User.findOne({ email: doctorEmail, userType: "doctor" });
        const name = await User.findOne({ username: patientName, userType: "patient" });
        const patient = await User.findOne({ email: patientEmail, userType: "patient" });

        if (!doctor || !patient) {
            return res.status(404).json({ message: "Doctor or patient not found." });
        }

        if (!name) {
            return res.status(404).json({ message: "Patient name is incorrect." });
        }

        // Create the prescription
        const prescription = new Prescription({
            doctorEmail,
            patientName,
            patientEmail,
            medicines,
            schedule,
        });

        const savedPrescription = await prescription.save();

        // Create reminders for the prescription
        await createRemindersFromPrescription(savedPrescription.patientEmail);

        res.status(201).json({ message: "Prescription created and reminders set.", prescription: savedPrescription });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

const getRemindersByPatient = async (req, res) => {
    try {
        const { patientEmail } = req.query;

        if (!patientEmail) {
            return res.status(400).json({ message: "Patient email is required." });
        }

        const reminders = await Reminder.find({ patientEmail });

        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reminders." });
    }
};

const updateReminder = async (req, res) => {
    try {
      const { id } = req.query; // Extract ID from query parameters
      const { status } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: "Reminder ID is required" });
      }
    
      const reminder = await Reminder.findById(id);
      if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
      }
    
      reminder.status = status || "Taken";
      await reminder.save();
    
      res.json({ message: "Reminder updated successfully", reminder });
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


module.exports = { signup, login, findUser, verifyEmail, resetPassword, createPrescription, prescriptionList, patientsList, doctorProfile, updateProfile, addProfile, qrcodeFunc, qrcodeforPatient, prescriptionListforPatient, createRemindersFromPrescription, getRemindersByPatient, updateReminder };