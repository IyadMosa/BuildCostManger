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

export const selectProject = (projectId, navigate) => (dispatch) => {
  localStorage.setItem("projectId", projectId);
  dispatch({ type: SELECT_PROJECT, payload: projectId });
  navigate("/dashboard");
};
