import { PROJECT_ERROR, PROJECTS, SELECT_PROJECT } from "../actions/types";

const initialState = {
  projects: [],
  selectedProjectId: null,
  error: null,
};
const handleErrorState = (state, action) => ({
  ...state,
  projects: [],
  selectedProjectId: null,
  error: action.payload || "An error occurred",
});

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case PROJECTS:
      return { ...state, projects: action.payload, error: null };
    case SELECT_PROJECT:
      return {
        ...state,
        selectedProjectId: action.payload,
      };
    case PROJECT_ERROR:
      return handleErrorState(state, action);
    default:
      return state;
  }
}
