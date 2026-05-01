import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('selectedInventory');

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    selectedInventory: stored ? JSON.parse(stored) : null,
  },
  reducers: {
    setSelectedInventory(state, action) {
      state.selectedInventory = action.payload;
      localStorage.setItem('selectedInventory', JSON.stringify(action.payload));
    },
  },
});

export const { setSelectedInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
