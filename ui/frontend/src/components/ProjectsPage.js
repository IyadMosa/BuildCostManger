import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@iyadmosa/react-library";
import { useDispatch, useSelector } from "react-redux";
import { getProjects, selectProject } from "../actions/projectAction";
import { useNavigate } from "react-router-dom";
const ProjectsPage = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getProjects());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);
  const projects = useSelector((state) => state.projects.projects) || [];

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => dispatch(selectProject(project.id, navigate))}
          style={{
            cursor: "pointer",
            padding: "10px",
            border: "1px solid #ccc",
            marginBottom: "5px",
          }}
        >
          {project.name}
        </div>
      ))}
    </div>
  );
};

export default ProjectsPage;
