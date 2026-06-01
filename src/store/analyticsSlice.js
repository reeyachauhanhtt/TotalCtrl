import { createSlice } from '@reduxjs/toolkit';

const storedDetailOpen = localStorage.getItem('analyticsDetailOpen') === 'true';
const storedSelectedInventory = localStorage.getItem(
  'analyticsSelectedInventory',
)
  ? JSON.parse(localStorage.getItem('analyticsSelectedInventory'))
  : null;

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    isDetailOpen: storedDetailOpen,
    selectedInventory: storedSelectedInventory,
  },
  reducers: {
    setAnalyticsDetailOpen: (state, action) => {
      state.isDetailOpen = action.payload;
      localStorage.setItem('analyticsDetailOpen', action.payload);
    },
    setAnalyticsSelectedInventory: (state, action) => {
      state.selectedInventory = action.payload;
      if (action.payload) {
        localStorage.setItem(
          'analyticsSelectedInventory',
          JSON.stringify(action.payload),
        );
      } else {
        localStorage.removeItem('analyticsSelectedInventory');
        localStorage.removeItem('analyticsDetailOpen');
      }
    },
  },
});

export const { setAnalyticsDetailOpen, setAnalyticsSelectedInventory } =
  analyticsSlice.actions;
export default analyticsSlice.reducer;
