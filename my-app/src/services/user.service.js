import api from "./api";

export const userService = {
  getUsers: () => api.get("/users"),
  inviteUser: (data) => api.post("/users/invite", data),
};

export default userService;
