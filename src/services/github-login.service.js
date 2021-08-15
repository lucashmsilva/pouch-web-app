import axios from "axios";

class GithubLoginService {
  
  constructor() {
    this.clientId = process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID;
    this.publicUrl = process.env.REACT_APP_PUBLIC_URL;    
  }

  getAuthorizeUri() {
    return axios.getUri({
      method: 'GET',
      url: 'https://github.com/login/oauth/authorize',
      params: {
        client_id: this.clientId,
        scope: 'user:email',
        redirect_uri: `${this.publicUrl}/login/github/callback`
      },
      headers: {
        "Content-type": "application/json"
      }
    });
  }
}

export default new GithubLoginService();