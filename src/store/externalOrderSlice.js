import { createSlice } from '@reduxjs/toolkit';

const storedDetailOpen = localStorage.getItem('isDetailOpen') === 'true';
const storedSelectedOrder = localStorage.getItem('selectedOrder')
  ? JSON.parse(localStorage.getItem('selectedOrder'))
  : null;

const externalOrderSlice = createSlice({
  name: 'externalOrder',
  initialState: {
    isDetailOpen: storedDetailOpen,
    selectedOrder: storedSelectedOrder,
  },
  reducers: {
    setDetailOpen: (state, action) => {
      state.isDetailOpen = action.payload;
      localStorage.setItem('isDetailOpen', action.payload);
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedOrder', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('selectedOrder');
        localStorage.removeItem('isDetailOpen');
      }
    },
  },
});

export const { setDetailOpen, setSelectedOrder } = externalOrderSlice.actions;
export default externalOrderSlice.reducer;
