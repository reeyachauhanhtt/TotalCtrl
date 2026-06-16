import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  fromInventory: null,
  toInventory: null,
  fromDropdownOpen: false,
  toDropdownOpen: false,
  selectedItems: [],
  quantities: {},
  searchQuery: '',
  locationError: false,
  selectionError: false,
};

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setFromInventory: (state, action) => {
      state.fromInventory = action.payload;
      if (state.toInventory?.id === action.payload?.id)
        state.toInventory = null;
    },
    setToInventory: (state, action) => {
      state.toInventory = action.payload;
    },
    setFromDropdownOpen: (state, action) => {
      state.fromDropdownOpen = action.payload;
      if (action.payload) state.toDropdownOpen = false;
    },
    setToDropdownOpen: (state, action) => {
      state.toDropdownOpen = action.payload;
      if (action.payload) state.fromDropdownOpen = false;
    },
    toggleItem: (state, action) => {
      state.selectionError = false;
      const exists = state.selectedItems.find(
        (i) => i.id === action.payload.id,
      );
      if (exists) {
        state.selectedItems = state.selectedItems.filter(
          (i) => i.id !== action.payload.id,
        );
      } else {
        state.selectedItems.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.selectedItems = state.selectedItems.filter(
        (i) => i.id !== action.payload,
      );
      delete state.quantities[action.payload];
    },
    setQuantity: (state, action) => {
      const { id, value } = action.payload;
      state.quantities[id] = value;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLocationError: (state, action) => {
      state.locationError = action.payload;
    },
    setSelectionError: (state, action) => {
      state.selectionError = action.payload;
    },
    clearSelection: (state) => {
      state.selectedItems = [];
      state.quantities = {};
      state.searchQuery = '';
      state.selectionError = false;
    },
    resetTransfer: () => initialState,
  },
});

export const {
  setStep,
  setFromInventory,
  setToInventory,
  setFromDropdownOpen,
  setToDropdownOpen,
  toggleItem,
  removeItem,
  setQuantity,
  setSearchQuery,
  setLocationError,
  setSelectionError,
  clearSelection,
  resetTransfer,
} = transferSlice.actions;

export default transferSlice.reducer;
