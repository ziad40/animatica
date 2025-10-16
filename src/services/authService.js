import api from "@/api/axiosInstance";

export const login = async (email, password) => {
  try {
    // Ensure leading slash so baseURL and path concatenate correctly
    const response = await api.post("/auth/login", { email, password });
    const token = response.data.token;
    localStorage.setItem("animatica_token", token);
    // routes user to home page
    return token;
  } catch (error) {
    console.error("Failed to login:", error);
    // Rethrow so callers can handle network/auth errors
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("animatica_token");
};

export const getToken = () => localStorage.getItem("animatica_token");