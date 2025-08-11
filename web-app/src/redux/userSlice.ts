import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserInfo from "../domain/dto/UserInfo";

const initialState: UserInfo = {
  id: "",
  lastLoginDate: null,
  createdAt: null,
  updatedAt: null,
  email: "",
  firstName: "",
  lastName: "",
  gender: "",
  birthDate: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo>) {
      state.id = action.payload.id;
      state.lastLoginDate = action.payload.lastLoginDate;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.gender = action.payload.gender;
      state.birthDate = action.payload.birthDate;
    },
    clearUser(state) {
      state = initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
