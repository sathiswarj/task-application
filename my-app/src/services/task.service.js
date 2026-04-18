import api from "./api";

export const taskService = {
  getTasks: () => api.get("/tasks"),
  getTaskById: (taskId) => api.get(`/tasks/${taskId}`),
  getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (taskId, taskData) => api.patch(`/tasks/${taskId}`, taskData),
  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default taskService;
