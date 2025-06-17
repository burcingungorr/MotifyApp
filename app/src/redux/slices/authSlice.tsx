import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  user?: {
    uid: string;
    email: string | null;
    avatar?: string; // EKLENDİ
  };
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        uid: string;
        email: string | null;
        avatar?: string;
      }>,
    ) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = undefined;
    },
    setAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
});

export const {loginSuccess, logout, setAvatar} = authSlice.actions;
export default authSlice.reducer;
