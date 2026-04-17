import api from "./api";

export const taskService = {
  getTasks: () => api.get("/tasks"),
  getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
};

export default taskService;
