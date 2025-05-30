import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 20px;
`;

export const ProjectCard = styled.div`
  padding: 20px;
  background: #f5f5f5;
  margin: 10px 0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2em;
`;

export const ProjectTitle = styled.h4`
  margin: 0;
`;

export const AddButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 10px 0;
`;

export const Button = styled.button`
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

export const ErrorText = styled.div`
  color: red;
  font-size: 0.9em;
  margin-bottom: 10px;
`;
