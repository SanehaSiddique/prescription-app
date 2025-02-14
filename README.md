# Digital Prescription and Medication Reminder App

## Overview
This is a **Digital Prescription and Medication Reminder App** that helps doctors generate and manage prescriptions while enabling patients to track and manage their medications efficiently.

## Features
### **Guest Mode**
- Displays an **introductory video** demonstrating app functionality.
- Provides **dummy doctor/patient credentials** to explore features.

### **Doctor Features**
- Dynamic dashboard displaying the **doctor's name**.
- Ability to **create prescriptions** with an option to generate a **QR code** for each prescription.
- View **all prescriptions** written, with a **search function** by patient name.
- View **all patients** they have ever treated.
- Create, view, and update **doctor profile**.
- **Logout functionality**.

### **Patient Features**
- Dynamic dashboard displaying the **patient's name**.
- Ability to **scan the latest prescription** received from a doctor.
- View **all past prescriptions** received from different doctors.
- Receive **medication reminders** with statuses:
  - **Pending**
  - **Taken**
  - **Missed**
- Mark medicines as **taken**.
- **Logout functionality**.

### **Additional Features**
- Fully **responsive** design.
- **Dark mode** support.
- **Strict authorization system**:
  - Doctors cannot access **patient pages**.
  - Patients cannot access **doctor pages**, either directly or indirectly.

## Technologies Used
- **Frontend:** React, TailwindCSS, Flowbite, Lucide-react (for icons), AOS Animations
- **State Management:** Redux Toolkit
- **Backend:** Node.js, Express.js
- **Authentication:** JWT Authentication
- **Database:** MongoDB (using Mongoose)
- **Other Libraries:** Axios, QR Code generation

## Installation and Setup
### **Prerequisites**
- Install **Node.js** and **npm**.
- Install **MongoDB**.

### **Backend Setup**
```bash
cd backend
npm install
npm start
```

### **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

## Usage
- Run the **backend** and **frontend**.
- Access the app via `http://localhost:5173` (default Vite development server).
- Explore features based on user roles (Doctor/Patient/Guest).

---
**Happy Coding! 🚀**
