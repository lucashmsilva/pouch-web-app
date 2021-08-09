import { ChangeEvent, Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import AuthService from "../services/auth.service";
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
        this.props.history.push('/articles');
        console.log('logged in!!');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({ loginLoading: false });
      });
  }

  register() {
    this.setState({ registrationLoading: true });
    AuthService.regsiter(this.state.registrationData)
      .then(() => {
        this.props.history.push('/articles');
        console.log('registered!!');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({ registrationLoading: false });
      });
  }

  checkSession() {
    this.setState({ loadingCheckingSession: true });
    AuthService.getUser()
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

  render() {
    const { loadingCheckingSession, registrationLoading, loginLoading } = this.state;
    return (
      <div>
        {loadingCheckingSession ? (
          <LoadingSpinner />
        ) : (
          <div className="session-box col-md-6">
            <div className="submit-form" >
              <h3>register</h3>
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
                <button className="btn btn-success" onClick={this.register}>register</button>
              )}

              <div className="divisor-block"><div className="divider" /> <h4>or</h4> <div className="divider" /> </div>

              <h3>login</h3>
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
                <button className="btn btn-success" onClick={this.login}>login</button>
              )}

            </div>
            {/* <div>
          <h1>get session</h1>
          <button className="btn btn-success" onClick={this.getUser}>submit</button>
          {user ? <h1>Welcome Back {user.name}</h1> : null}
        </div> */}
          </div >
        )}
      </div>
    );
  }
}

export default withRouter(Login);