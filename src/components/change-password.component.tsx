import { ChangeEvent, Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import AuthService from "../services/auth.service";
import LoadingSpinner from "./loading.component";
import IUserData from '../types/user.type';

type Props = RouteComponentProps;

type State = {
  userData?: IUserData
  currentPassword: string
  newPassword: string
  loadingCheckingSession: boolean
  loadingChangePasswordRequest: boolean
};

class ChangePassword extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.changePassword = this.changePassword.bind(this);
    this.checkSession = this.checkSession.bind(this);
    this.onChangeCurrentPasswordInput = this.onChangeCurrentPasswordInput.bind(this);
    this.onChangeNewPasswordInput = this.onChangeNewPasswordInput.bind(this);

    this.state = {
      currentPassword: '',
      newPassword: '',
      loadingCheckingSession: false,
      loadingChangePasswordRequest: false,
    };
  }

  componentDidMount() {
    this.checkSession();
  }

  changePassword() {
    this.setState({ loadingChangePasswordRequest: true });
    AuthService.changePassword(this.state.newPassword, this.state.currentPassword)
      .then(() => {
        this.props.history.push('/articles');
        console.log('updated password!!');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({ loadingChangePasswordRequest: false });
      });
  }

  checkSession() {
    this.setState({ loadingCheckingSession: true });
    AuthService.getSession()
      .then(response => {
        if (response.data?.id) {
          this.setState({
            userData: {
              id: response.data?.id,
              name: response.data?.name,
              email: response.data?.email,
              isSocialSingup: response.data?.isSocialSingup,
            },
            loadingCheckingSession: false
          });
        }

        console.log(response.data);
      })
      .catch(error => {
        this.setState({ loadingCheckingSession: false });
        this.props.history.push('/');
      });
  }

  onChangeCurrentPasswordInput(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ currentPassword: e.target.value });
  }

  onChangeNewPasswordInput(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ newPassword: e.target.value });
  }

  render() {
    const { loadingCheckingSession, loadingChangePasswordRequest, userData } = this.state;
    return (
      <div>
        {loadingCheckingSession ? (
          <LoadingSpinner />
        ) : (
          <div className="session-box col-md-6">
            <div className="submit-form" >
              <h3><strong>change login password</strong></h3>

              {!userData?.isSocialSingup ? (
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="current password"
                    type="password"
                    onChange={this.onChangeCurrentPasswordInput}
                  />
                </div>
              ) : (
                <div style={{display: "hidden"}} />
              )}

              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="new password"
                  type="password"
                  onChange={this.onChangeNewPasswordInput}
                />
              </div>

              {loadingChangePasswordRequest ? (
                <LoadingSpinner />
              ) : (
                <div className="login-options">
                  <button className="btn btn-success" onClick={this.changePassword}>submit</button>
                </div>
              )}
            </div>
          </div >
        )}
      </div>
    );
  }
}

export default withRouter(ChangePassword);