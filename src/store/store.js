import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import transferReducer from './transferSlice';
import externalOrderReducer from './externalOrderSlice';

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    transfer: transferReducer,
    externalOrder: externalOrderReducer,
  },
});

export default store;
