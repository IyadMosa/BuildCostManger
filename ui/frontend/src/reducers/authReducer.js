import {
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_ERROR,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token") || null,
  error: null,
};

const handleErrorState = (state, action) => ({
  ...state,
  token: null,
  error: action.payload || "An error occurred",
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, token: action.payload, error: null };

    case LOGIN_ERROR:
    case REGISTER_ERROR:
      return handleErrorState(state, action);
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("projectId");
      localStorage.removeItem("projectName");
      return { ...state, token: null, error: null };

    default:
      return state;
  }
}
