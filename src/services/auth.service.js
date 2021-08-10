import http from "../http-common";

class AuthService {
  login(loginData) {
    http.options.withCredentials = true;
    return http.post("/auth/login", loginData);
  }

  regsiter(registrationData) {
    http.options.withCredentials = true;
    return http.post("/auth/register", registrationData);
  }

  logout() {
    http.options.withCredentials = true;
    return http.delete("/auth/logout");
  }

  getSession() {
    http.options.withCredentials = true;
    return http.get("/auth/session");
  }
}

export default new AuthService();