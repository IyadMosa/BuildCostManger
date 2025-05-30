import { RestRequest } from "./RestRequest";
import { PROJECTS, SELECT_PROJECT } from "./types";

export const getProjects = () => (dispatch) => {
  return RestRequest(`/api/projects`, "GET", null)
    .then((data) => {
      dispatch({ type: PROJECTS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: "PROJECT_ERROR", payload: error.message });
    });
};

export const createProject = (name) => {
  return RestRequest("/api/projects", "POST", { name });
};
export const selectProject = (project, navigate) => (dispatch) => {
  localStorage.setItem("projectId", project.id);
  localStorage.setItem("projectName", project.name);
  navigate("/dashboard");
};
