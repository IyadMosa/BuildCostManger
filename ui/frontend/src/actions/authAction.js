import { RestRequest } from "./RestRequest";
import {
  GET_USER,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
} from "./types";

import axios from "axios";
export const login = (auth, navigate) => async (dispatch, getState) => {
  try {
    const data = await RestRequest("/api/auth/login", "POST", auth)(dispatch, getState);

    if (data.success === false) {
      dispatch({ type: LOGIN_ERROR, payload: data.message });
    } else {
      localStorage.setItem("token", data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.token });
      navigate("/dashboard"); // Navigate after successful login
    }
  } catch (error) {
    dispatch({ type: LOGIN_ERROR, payload: error.message || "Login failed" });
  }
};

export const register = (user) => (dispatch, getState) =>
  RestRequest(
    "/api/auth/register",
    "POST",
    user,
    "register success"
  )(dispatch, getState)
    .then(() => {
      dispatch({ type: REGISTER_SUCCESS });
    })
    .catch((error) => {
      dispatch({ type: REGISTER_ERROR, payload: error.message });
    });

export const whoami = () => (dispatch, getState) =>
  RestRequest(
    "/api/user/whoami",
    "GET",
    null,
    "got user success"
  )(dispatch, getState)
    .then((data) => {
      dispatch({ type: GET_USER, payload: data });
    })
    .catch((error) => {
      dispatch({ type: REGISTER_ERROR, payload: error.message });
    });
