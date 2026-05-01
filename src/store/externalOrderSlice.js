import { createSlice } from '@reduxjs/toolkit';

const externalOrderSlice = createSlice({
  name: 'externalOrder',
  initialState: { isDetailOpen: false, selectedOrder: null },
  reducers: {
    setDetailOpen: (state, action) => {
      state.isDetailOpen = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const { setDetailOpen, setSelectedOrder } = externalOrderSlice.actions;
export default externalOrderSlice.reducer;
