
let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const ENV = process.env.NODE_ENV;

switch (ENV) {
    case "production":

        API_BASE_URL = "http://localhost:5000/api";
        break;
    default:
        API_BASE_URL = "http://localhost:5000/api";
        break;
}



const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("jwt_token");
    }
    return null;
};


const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const isFormData = options.body instanceof FormData;

    const defaultHeaders = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (isFormData) {
        delete defaultHeaders["Content-Type"];
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem("jwt_token");
                window.location.href = "/login";
            }
            throw new Error(
                "Session expired or unauthorized. Redirecting to login...",
            );
        }

        const error = await response
            .json()
            .catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};


export const api = {
    get: (endpoint, options = {}) => {
        let url = endpoint;
        if (options.params) {
            const params = new URLSearchParams();
            Object.entries(options.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, value);
                }
            });
            const queryString = params.toString();
            if (queryString) {
                url += (url.includes("?") ? "&" : "?") + queryString;
            }
        }
        return apiRequest(url, { ...options, method: "GET" });
    },

    post: (endpoint, data = {}, options = {}) => {
        const isFormData = data instanceof FormData;
        const headers = { ...options.headers };
        if (isFormData) {
            delete headers["Content-Type"];
        }
        return apiRequest(endpoint, {
            ...options,
            headers,
            method: "POST",
            body: isFormData ? data : JSON.stringify(data),
        });
    },

    put: (endpoint, data = {}, options = {}) => {
        const isFormData = data instanceof FormData;
        const headers = { ...options.headers };
        if (isFormData) {
            delete headers["Content-Type"];
        }
        return apiRequest(endpoint, {
            ...options,
            headers,
            method: "PUT",
            body: isFormData ? data : JSON.stringify(data),
        });
    },

    patch: (endpoint, data = {}, options = {}) => {
        const isFormData = data instanceof FormData;
        const headers = { ...options.headers };
        if (isFormData) {
            delete headers["Content-Type"];
        }
        return apiRequest(endpoint, {
            ...options,
            headers,
            method: "PATCH",
            body: isFormData ? data : JSON.stringify(data),
        });
    },

    delete: (endpoint, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "DELETE",
            body: JSON.stringify({}),
        }),
};

export default api;
