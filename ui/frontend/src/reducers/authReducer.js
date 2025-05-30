import {
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_ERROR,
} from "../actions/types";

const initialState = {};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("projectId");
      localStorage.removeItem("projectName");
      return state;

    default:
      return state;
  }
}
