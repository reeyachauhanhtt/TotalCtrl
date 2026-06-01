import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import transferReducer from './transferSlice';
import externalOrderReducer from './externalOrderSlice';
import internalOrderReducer from './internalOrderSlice';
import analyticsReducer from './analyticsSlice';

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    transfer: transferReducer,
    externalOrder: externalOrderReducer,
    internalOrder: internalOrderReducer,
    analytics: analyticsReducer,
  },
});

export default store;
