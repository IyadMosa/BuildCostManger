import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { LOGOUT } from "./actions/types";
import { useNavigate } from "react-router-dom";

const TokenWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            dispatch({ type: LOGOUT });
            navigate("/", { replace: true });
          }
        } catch (err) {
          dispatch({ type: LOGOUT });
          navigate("/", { replace: true });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return null;
};

export default TokenWatcher;
