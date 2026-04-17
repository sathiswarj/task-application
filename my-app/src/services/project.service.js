import api from "./api";

export const projectService = {
  getProjects: () => api.get("/projects"),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post("/projects", data),
};

export default projectService;
