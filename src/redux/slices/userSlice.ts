import type { UserTypes } from '@/_types/_user';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: UserTypes.InitialState = {
  isAuthenticated: false,
  isInitialized: false,
  userProfile: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    createUser(state, action: PayloadAction<UserTypes.UserProfile>) {
      state.userProfile = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
  },
});

export const { createUser } = userSlice.actions;

export default userSlice.reducer;
