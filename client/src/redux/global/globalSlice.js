// src/redux/slices/globalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mapState: null,
  filteredPins: [],
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMapState: (state, action) => {
      state.mapState = action.payload;
    },
    setFilteredPins: (state, action) => {
      state.filteredPins = action.payload;
    },
  },
});

export const { setMapState, setFilteredPins } = globalSlice.actions;
export default globalSlice.reducer;
