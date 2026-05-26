import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import transferReducer from './transferSlice';
import externalOrderReducer from './externalOrderSlice';
import internalOrderReducer from './internalOrderSlice';

const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    transfer: transferReducer,
    externalOrder: externalOrderReducer,
    internalOrder: internalOrderReducer,
  },
});

export default store;
