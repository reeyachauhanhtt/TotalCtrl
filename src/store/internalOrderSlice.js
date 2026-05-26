import { createSlice } from '@reduxjs/toolkit';

const storedDetailOpen =
  localStorage.getItem('isInternalDetailOpen') === 'true';
const storedSelectedOrder = localStorage.getItem('selectedInternalOrder')
  ? JSON.parse(localStorage.getItem('selectedInternalOrder'))
  : null;

const internalOrderSlice = createSlice({
  name: 'internalOrder',
  initialState: {
    isDetailOpen: storedDetailOpen,
    selectedOrder: storedSelectedOrder,
  },
  reducers: {
    setInternalDetailOpen: (state, action) => {
      state.isDetailOpen = action.payload;
      localStorage.setItem('isInternalDetailOpen', action.payload);
    },
    setSelectedInternalOrder: (state, action) => {
      state.selectedOrder = action.payload;
      if (action.payload) {
        localStorage.setItem(
          'selectedInternalOrder',
          JSON.stringify(action.payload),
        );
      } else {
        localStorage.removeItem('selectedInternalOrder');
        localStorage.removeItem('isInternalDetailOpen');
      }
    },
  },
});

export const { setInternalDetailOpen, setSelectedInternalOrder } =
  internalOrderSlice.actions;
export default internalOrderSlice.reducer;
