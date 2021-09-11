import { Component } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import AuthService from "../services/auth.service";

type ExtraProps = {
  setLoading: (isLoading: boolean) => void
  hideMenus: boolean
}

type Props = RouteComponentProps & ExtraProps;

type State = {
  loading: boolean
};

class NavBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.logout = this.logout.bind(this);

    this.state = {
      loading: false
    };
  }

  logout() {
    this.props.setLoading(true);
    AuthService.logout()
      .then(() => this.props.history.push("/"))
      .catch(error => console.log(error))
      .finally(() => this.props.setLoading(false));
  }

  render() {
    const { hideMenus } = this.props;
    return (
      <nav className="navbar navbar-expand  ">
        <Link to={"/articles"} className="navbar-brand">
          <strong><p>pouch</p></strong>
        </Link>

        <div className={`navbar-nav mr-auto ${hideMenus ? 'd-none' : ''}`}>
          <li className="nav-item">
            <Link to={"/articles"} className="nav-link">
              my list
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              add
            </Link>
          </li>
        </div>

        <div className={`navbar-nav ml-auto ${hideMenus ? 'd-none' : ''}`}>
          <NavDropdown
            id="nav-dropdown-dark-example"
            title="options"
          >
            <NavDropdown.Item onClick={() => this.props.history.push('/change-password')}>change password</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={this.logout}>logout</NavDropdown.Item>
          </NavDropdown>
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
