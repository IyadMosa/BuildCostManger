// src/hooks/useTokenWatcher.js
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { LOGOUT } from "./actions/types";

const useTokenWatcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            dispatch({ type: LOGOUT });
            window.location.href = "/";
          }
        } catch (err) {
          dispatch({ type: LOGOUT });
          window.location.href = "/";
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useTokenWatcher;
