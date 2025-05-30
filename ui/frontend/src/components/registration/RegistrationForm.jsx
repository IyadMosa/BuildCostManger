import React, { useState } from "react";
import { Button, Container, ErrorText, Input, Label, Title } from "./style";
import { checkUsername, registerUser } from "../../actions/authAction";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(null);

  const checkUsernameAvailability = async () => {
    const res = await checkUsername(username);
    setAvailable(res.available);
    setError(res.available ? "" : "Username is already taken");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    await checkUsernameAvailability();
    if (!available) return;

    const response = await registerUser({ username, password });
    if (response.success) {
      setError("");
      navigate("/");
    } else setError(response.message);
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Title>Register</Title>
      <div>
        <Label>Username</Label>
        <Input
          type="text"
          value={username}
          error={available === false}
          onChange={(e) => {
            setUsername(e.target.value);
            setAvailable(null);
            setError("");
          }}
          onBlur={checkUsernameAvailability}
          required
        />
        {available === false && <ErrorText>{error}</ErrorText>}
      </div>
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Confirm Password</Label>
        <Input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      {error && available !== false && <ErrorText>{error}</ErrorText>}
      <Button type="submit">Register</Button>
      <Button
        type="button"
        onClick={() => navigate("/")}
        style={{ marginTop: "10px" }}
      >
        Back to Login
      </Button>
    </Container>
  );
};

export default RegistrationForm;
