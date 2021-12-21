import { ChangeEvent, Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import queryString from 'query-string';

import AuthService from "../services/auth.service";
import LoadingSpinner from "./loading.component";

type Props = RouteComponentProps;

type State = {
  emailAddress: string
  newPassword: string
  loading: boolean
  operationJWT: string
};

class ResetPassword extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.resetPassword = this.resetPassword.bind(this);
    this.sendResetPasswordMail = this.sendResetPasswordMail.bind(this);
    this.onChangeEmailAddressInput = this.onChangeEmailAddressInput.bind(this);
    this.onChangeNewPasswordInput = this.onChangeNewPasswordInput.bind(this);

    this.state = {
      emailAddress: '',
      newPassword: '',
      loading: false,
      operationJWT: ''
    };
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    let operationJWT = params.operationJWT as string;

    this.setState({ operationJWT });
  }

  resetPassword() {
    this.setState({ loading: true });
    AuthService.resetPassword(this.state.operationJWT, this.state.newPassword)
      .then(() => {
        console.log('reset password!!');
        this.props.history.push('/');
      })
      .catch(error => {
        console.log(error);
      });
  }

  sendResetPasswordMail() {
    this.setState({ loading: true });
    AuthService.sendPasswordResetMail(this.state.emailAddress)
      .then(response => {
        if (response.data?.id) {
          this.setState({
            loading: false
          });
        }

        console.log('email sent!!');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({ loading: false });
        this.props.history.push('/');
      });
  }

  onChangeEmailAddressInput(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ emailAddress: e.target.value });
  }

  onChangeNewPasswordInput(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ newPassword: e.target.value });
  }

  render() {
    const { loading, operationJWT } = this.state;
    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="d-flex justify-content-center">
            <div className="submit-form" >
              <h3><strong>{operationJWT ? 'enter the new password' : 'enter the email to receive the link'}</strong></h3>
              {operationJWT ? (
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="new password"
                    type="password"
                    onChange={this.onChangeNewPasswordInput}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="email address"
                    onChange={this.onChangeEmailAddressInput}
                  />
                </div>
              )}

              <div>
                {operationJWT ? (
                  <button className="btn btn-success" onClick={this.resetPassword}>submit</button>
                ) : (
                  <button className="btn btn-success" onClick={this.sendResetPasswordMail}>submit</button>
                )}
              </div>

            </div>
          </div >
        )}
      </div>
    );
  }
}

export default withRouter(ResetPassword);