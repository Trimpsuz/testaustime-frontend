import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UsersSlice {
  authToken: string,
  username: string,
  registrationTime: Date,
  friendCode: string,
  friends: Array<string>
}

const initialState: UsersSlice = {
  authToken: localStorage.getItem("authToken") || "",
  username: "",
  registrationTime: new Date(),
  friendCode: "",
  friends: [""]
};

export const usersSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setRegisterTime: (state, action: PayloadAction<Date>) => {
      state.registrationTime = action.payload;
    },
    setFriendCode: (state, action: PayloadAction<string>) => {
      state.friendCode = action.payload;
    },
    setFriends: (state, action: PayloadAction<Array<string>>) => {
      state.friends = action.payload;
    },
  },
});

export const { setAuthToken, setUsername, setRegisterTime, setFriendCode, setFriends } = usersSlice.actions;
export default usersSlice.reducer;