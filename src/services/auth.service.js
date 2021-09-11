import http from "../http-common";

class AuthService {
  constructor() {
    this.publicUrl = process.env.REACT_APP_PUBLIC_URL;    
  }

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

  sendPasswordResetMail(recoverEmail) {
    const redirectURL = `${this.publicUrl}/reset-password`;
    http.options.withCredentials = false;
    return http.post("/auth/mail/password-reset", { recoverEmail, redirectURL });
  }

  resetPassword(operationJWT, newPassowrd) {
    http.options.withCredentials = false;
    return http.put(`/user/password/${operationJWT}`, { newPassowrd });
  }
}

export default new AuthService();