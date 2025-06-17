import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface XPState {
  value: number;
  level: number;
}

const initialState: XPState = {
  value: 0,
  level: 1,
};

const xpSlice = createSlice({
  name: 'xp',
  initialState,
  reducers: {
    setXP: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
      state.level = Math.floor(action.payload / 200) + 1;
    },
  },
});

export const {setXP} = xpSlice.actions;
export default xpSlice.reducer;
