import { ChangeEvent, Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GithubLoginButton } from "react-social-login-buttons";

import AuthService from "../services/auth.service";
import GithubLoginService from "../services/github-login.service";
import IUserLoginData from '../types/user-login.type';
import IUserRegistrationData from '../types/user-registration.type';
import LoadingSpinner from "./loading.component";

type Props = RouteComponentProps;

type State = {
  registrationData: IUserRegistrationData
  loginData: IUserLoginData
  loadingCheckingSession: boolean,
  registrationLoading: boolean
  loginLoading: boolean
};

class Login extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.checkSession = this.checkSession.bind(this);
    this.onChangeEmailInput = this.onChangeEmailInput.bind(this);
    this.onChangeNameInput = this.onChangeNameInput.bind(this);
    this.onChangeRegisterPasswordInput = this.onChangeRegisterPasswordInput.bind(this);
    this.onChangeUsernameInput = this.onChangeUsernameInput.bind(this);
    this.onChangeLoginPasswordInput = this.onChangeLoginPasswordInput.bind(this);
    this.githubOAuthCall = this.githubOAuthCall.bind(this);

    this.state = {
      registrationData: {
        name: '',
        email: '',
        password: ''
      },
      loginData: {
        username: '',
        password: ''
      },
      loadingCheckingSession: false,
      registrationLoading: false,
      loginLoading: false
    };
  }

  componentDidMount() {
    this.checkSession();
  }

  login() {
    this.setState({ loginLoading: true });
    AuthService.login(this.state.loginData)
      .then(() => {
        this.setState({ loginLoading: false });
        this.props.history.push('/articles');
        console.log('logged in!!');
      })
      .catch(error => {
        console.log(error);
        this.setState({ loginLoading: false });
      });
  }

  register() {
    this.setState({ registrationLoading: true });
    AuthService.regsiter(this.state.registrationData)
      .then(() => {
        this.setState({ registrationLoading: false });
        this.props.history.push('/articles');
        console.log('registered!!');
      })
      .catch(error => {
        this.setState({ registrationLoading: false });
        console.log(error);
      });
  }

  checkSession() {
    this.setState({ loadingCheckingSession: true });
    AuthService.getSession()
      .then(response => {
        if (response.data?.id) {
          this.props.history.push('/articles');
        } else {
          this.setState({ loadingCheckingSession: false });
        }

        console.log(response.data);
      })
      .catch(error => {
        this.setState({ loadingCheckingSession: false });
      });
  }

  onChangeEmailInput(e: ChangeEvent<HTMLInputElement>) {
    const registrationData = this.state.registrationData;
    registrationData.email = e.target.value
    this.setState({ registrationData });
  }

  onChangeNameInput(e: ChangeEvent<HTMLInputElement>) {
    const registrationData = this.state.registrationData;
    registrationData.name = e.target.value
    this.setState({ registrationData });
  }

  onChangeRegisterPasswordInput(e: ChangeEvent<HTMLInputElement>) {
    const registrationData = this.state.registrationData;
    registrationData.password = e.target.value
    this.setState({ registrationData });
  }

  onChangeUsernameInput(e: ChangeEvent<HTMLInputElement>) {
    const loginData = this.state.loginData;
    loginData.username = e.target.value
    this.setState({ loginData });
  }

  onChangeLoginPasswordInput(e: ChangeEvent<HTMLInputElement>) {
    const loginData = this.state.loginData;
    loginData.password = e.target.value
    this.setState({ loginData });
  }

  githubOAuthCall() {
    const authorizeUri = GithubLoginService.getAuthorizeUri();

    window.location.href = authorizeUri;
  }

  render() {
    const { loadingCheckingSession, registrationLoading, loginLoading } = this.state;
    return (
      <div>
        {loadingCheckingSession ? (
          <LoadingSpinner />
        ) : (
          <div className="session-box col-md-6">
            <div className="submit-form" >
            <h3><strong>register</strong></h3>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="email"
                  onChange={this.onChangeEmailInput}
                />
              </div>

              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="name"
                  onChange={this.onChangeNameInput}
                />
              </div>

              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="password"
                  type="password"
                  onChange={this.onChangeRegisterPasswordInput}
                />
              </div>

              {registrationLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="login-options">
                  <button className="btn btn-success" onClick={this.register}>register</button> 
                  <GithubLoginButton onClick={this.githubOAuthCall} align="center"> <span>register </span> </GithubLoginButton>
                </div>
              )}

              <div className="divisor-block"><div className="divider" /> <h4>or</h4> <div className="divider" /> </div>

              <h3><strong>login</strong></h3>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="email"
                  onChange={this.onChangeUsernameInput}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="password"
                  type="password"
                  onChange={this.onChangeLoginPasswordInput}
                />
              </div>

              {loginLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="login-options">
                  <button className="btn btn-success" onClick={this.login}>login</button>
                  <GithubLoginButton onClick={this.githubOAuthCall} align="center" > <span>login</span> </GithubLoginButton>
                </div>
              )}
            </div>
          </div >
        )}
      </div>
    );
  }
}

export default withRouter(Login);