import axios from "axios";

const API_URL = "http://localhost:5000";

export const login = async (email, senha) => {
  const response = await axios.post(`${API_URL}/login`, { email, senha });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");
