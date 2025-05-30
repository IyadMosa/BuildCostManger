import styled from "styled-components";

export const Container = styled.form`
  max-width: 400px;
  margin: 3rem auto;
  background: #fff;
  padding: 2rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 2px solid ${({ error }) => (error ? "#e74c3c" : "#ccc")};
  margin-bottom: 1rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: -0.8rem;
  margin-bottom: 1rem;
`;

export const Button = styled.button`
  width: 100%;
  background: #3498db;
  color: #fff;
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #2980b9;
  }
`;
