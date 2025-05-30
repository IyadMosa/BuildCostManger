import React from "react";
import styled from "styled-components";

const ProjectNameContainer = styled.h2`
  font-size: 2rem;
  color: whitesmoke;
  text-align: left;
  margin: 20px 0;
  font-weight: bold;
`;

const SelectedProjectName = () => {
  const selectedProjectName = localStorage.getItem("projectName");

  return <ProjectNameContainer>{selectedProjectName}</ProjectNameContainer>;
};

export default SelectedProjectName;
