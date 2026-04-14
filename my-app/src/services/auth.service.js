import api from './api';

export const authService = {
    // Login with email and password
    login: async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        if (response.token) {
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    // Signup new user
    signup: (data) => api.post('/users/signup', data),

    // Logout
    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};