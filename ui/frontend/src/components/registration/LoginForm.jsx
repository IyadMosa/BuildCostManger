import React, { useState } from "react";
import { Button, Container, ErrorText, Input, Label, Title } from "./style";
import { login_new } from "../../actions/authAction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = await login_new(username, password);
    if (result.success) {
      setErrorMsg("");
      navigate("/projects");
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <Container onSubmit={handleLogin}>
      <Title>Login</Title>

      <div>
        <Label>Username</Label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
      </div>

      <Button type="submit">Login</Button>
      <Button
        type="button"
        onClick={() => navigate("/register")}
        style={{ marginTop: "10px" }}
      >
        Register
      </Button>
    </Container>
  );
};

export default LoginForm;
