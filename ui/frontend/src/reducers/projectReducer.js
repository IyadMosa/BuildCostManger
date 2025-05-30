import { PROJECT_ERROR, PROJECTS, SELECT_PROJECT } from "../actions/types";

const initialState = {
  projects: [],
  error: null,
};
const handleErrorState = (state, action) => ({
  ...state,
  projects: [],
  error: action.payload || "An error occurred",
});

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case PROJECTS:
      return { ...state, projects: action.payload, error: null };
    case PROJECT_ERROR:
      return handleErrorState(state, action);
    default:
      return state;
  }
}
