import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import rootReducer from './rootReducer';

import xpReducer from './slices/xpSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    xp: xpReducer,
    reducer: rootReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
