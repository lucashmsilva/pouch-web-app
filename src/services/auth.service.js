import http from "../http-common";

class AuthService {
  login(loginData) {
    http.options.withCredentials = true;
    return http.post("/auth/login", loginData);
  }

  githubLogin(loginData) {
    http.options.withCredentials = true;
    return http.post("/auth/login/github", loginData);
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
    return http.get("/user/session");
  }

  changePassword(newPassowrd, currentPassword) {
    http.options.withCredentials = true;
    return http.patch("/user/password", { newPassowrd, currentPassword });
  }
}

export default new AuthService();