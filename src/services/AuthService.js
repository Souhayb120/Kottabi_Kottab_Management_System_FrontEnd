import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/Api";
const API_BASE_URL = "http://localhost:8080/api/auth";

class AuthService {
  register(user) {
    return api.post(`${API_BASE_URL}/register`, user);
  }

  login(credentials) {
    return api.post(`${API_BASE_URL}/login`, credentials);
  }

  logout() {
    localStorage.removeItem("token");
  }
}

export default new AuthService();
