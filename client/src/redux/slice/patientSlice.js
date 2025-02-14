import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch patient details by email
export const fetchPatientByEmail = createAsyncThunk(
  "patient/fetchPatientByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/web/api/patient?email=${email}`);

      if (!response.data) {
        throw new Error("Patient not found");
      }
      
      return response.data; // Ensure backend returns patient object
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient data");
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState: {
    data: null, // Stores patient details
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store patient details
      })
      .addCase(fetchPatientByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default patientSlice.reducer;
