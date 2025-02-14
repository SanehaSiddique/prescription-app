import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import doctorReducer from "./slice/doctorSlice"; // import the doctor slice
import patientReducer from "./slice/patientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    patient: patientReducer,
  },
});

export default store;
