import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddButton,
  Button,
  ErrorText,
  Input,
  ModalContent,
  ModalOverlay,
  PageContainer,
  ProjectCard,
  ProjectTitle,
} from "./style";
import {
  createProject,
  getProjects,
  selectProject,
} from "../../actions/projectAction";
import { LoadingSpinner } from "@iyadmosa/react-library";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getProjects());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);
  const projects = useSelector((state) => state.projects.projects) || [];
  const handleCreateProject = async () => {
    setError("");
    const result = await createProject(newProjectName);
    console.log("Create Project Result:", result);
    if (result.success) {
      setShowModal(false);
      setNewProjectName("");
      window.location.reload();
    } else {
      setError(result.message || "Failed to create project.");
    }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <PageContainer>
      <AddButton onClick={() => setShowModal(true)}>+ New Project</AddButton>

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          onClick={() => dispatch(selectProject(project.id, navigate))}
        >
          <ProjectTitle>{project.name}</ProjectTitle>
        </ProjectCard>
      ))}

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Create New Project</h3>
            <Input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
            />
            {error && <ErrorText>{error}</ErrorText>}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleCreateProject}>Create</Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default ProjectsPage;
