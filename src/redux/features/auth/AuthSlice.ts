import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { TUser } from "../../../types/User";



type TAuthState = {
  user: TUser | null;
  token: string | null;
};


const initialState: TAuthState = {
  user: null,
  token: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    
    updateUser: (state, action: PayloadAction<{ data: TUser }>) => {
      if (state.user && action?.payload?.data?.id) {
        state.user = { ...state.user, ...action.payload.data };
      }
    },
  },
});


export const { setUser, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;


export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
