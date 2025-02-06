import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {login} from "../actions/authAction";
import {LoginScreen} from "@iyadmosa/react-library";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Access loginErrorMsg from state
    const loginErrorMsg = useSelector((state) => state.auth.error);
    // Effect to check and log error message every time it changes
    useEffect(() => {
        if (loginErrorMsg) {
            console.log("Login Error:", loginErrorMsg); // Log the error message
        }
    }, [loginErrorMsg]); // Effect triggers when loginErrorMsg changes

    const handleLogin = (auth) => {
        console.log("Login:", auth); // Log the login details
        dispatch(login(auth, navigate)); // Dispatch login action
    };

    return (
        <div>
            <LoginScreen
                onLogin={handleLogin}
                imgPath="https://images.unsplash.com/photo-1542838132-92c53300491e"
                errorMsg={loginErrorMsg}
            />
            {loginErrorMsg && (
                <p style={{ color: "red" }}>{loginErrorMsg}</p> // Display error message if present
            )}
        </div>
    );
};

export default LoginPage;
