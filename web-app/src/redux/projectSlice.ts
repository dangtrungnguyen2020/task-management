import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../domain/dto/Project";

export interface ProjectState {
  selectedProject: Project | null;
}

// Set the initial state
const initialState: ProjectState = {
  selectedProject: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    // Reducer to set the currently selected project
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    // Reducer to clear the selected project
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
});

// Export the actions
export const { setSelectedProject, clearSelectedProject } =
  projectSlice.actions;

// Export the reducer
export default projectSlice.reducer;
