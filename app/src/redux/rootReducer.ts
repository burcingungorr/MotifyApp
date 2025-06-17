import {combineReducers} from '@reduxjs/toolkit';
import authReducer, {logout} from './slices/authSlice';
import xpReducer from './slices/xpSlice';

const appReducer = combineReducers({
  auth: authReducer,
  xp: xpReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any,
) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
