import {
  GET_USER,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token") || null,
  error: null,
};

const handleErrorState = (state, action) => ({
  ...state,
  token: null,
  error: action.payload || "An error occurred", // Ensure error message is printed properly
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, token: action.payload, error: null };

    case LOGIN_ERROR:
    case REGISTER_ERROR:
      return handleErrorState(state, action);

    default:
      return state;
  }
}
