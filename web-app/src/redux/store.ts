import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import projectReducer from "./projectSlice"; // Import the new project reducer

const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer, // Add the project reducer to the store
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
