import { jwtDecode } from "jwt-decode";
import api from "../api/Api";

class AuthService {
  login(credentials) {
    return api.post("api/auth/login", credentials);
  }

  saveToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  hasToken() {
    return Boolean(this.getToken());
  }

  getUsername() {
    try {
      return jwtDecode(this.getToken()).sub || "";
    } catch {
      return "";
    }
  }

  getRole() {
    return this.getRawRole().replace("ROLE_", "");
  }

  getRawRole() {
    try {
      return jwtDecode(this.getToken()).role || "";
    } catch {
      return "";
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }
}

export default new AuthService();