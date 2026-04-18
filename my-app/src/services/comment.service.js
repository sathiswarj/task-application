import api from "./api";

export const commentService = {
  getCommentsByTask: (taskId) => api.get(`/comments/task/${taskId}`),
  addComment: (data) => api.post("/comments", data),
  addReaction: (id, emoji) => api.post(`/comments/${id}/react`, { emoji })
};

export default commentService;
