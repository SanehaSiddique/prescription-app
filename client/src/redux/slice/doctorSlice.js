import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch doctor details by email
// "doctor/fetchDoctorByEmail" it is the action type
// the async function is the payload creator creates the payload from the backend response
export const fetchDoctorByEmail = createAsyncThunk(
  "doctor/fetchDoctorByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/web/api/doctor?email=${email}`);

      if (!response.data) {
        throw new Error("Doctor not found");
      }

      return response.data; // Ensure backend returns doctor object
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor data");
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    data: null, // Stores doctor details
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store doctor details
      })
      .addCase(fetchDoctorByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default doctorSlice.reducer;
