import { Component } from "react";
import { Switch, Route, Link, RouteComponentProps, withRouter } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddArticle from "./components/add-article.component";
import Article from "./components/article.component";
import ArticleList from "./components/article-list.component";
import Login from "./components/login.component";
import GitHubLoginCallback from "./components/github-login-callback.component";
import ChangePassword from "./components/change-password.component";

import LoadingSpinner from "./components/loading.component";
import LogoutLink from "./components/logout-link.component";


type Props = RouteComponentProps;

type State = {
  loading: boolean
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.setLoading = this.setLoading.bind(this);

    this.state = {
      loading: false
    };
  }

  setLoading(isLoading: boolean) {
    this.setState({
      loading: isLoading
    })
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand  ">
          <Link to={"/articles"} className="navbar-brand">
            <strong><p>pouch</p></strong>
          </Link>
          <div className="navbar-nav mr-auto">
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

          <div className="navbar-nav ml-auto">
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="options"
            >
              <NavDropdown.Item onClick={() => this.props.history.push('/change-password')}>change password</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => this.setState({ loading: true })}>
                <LogoutLink setLoading={this.setLoading} />
              </NavDropdown.Item>
            </NavDropdown>
          </div>

        </nav>

        <div className="container mt-3">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Switch>
              <Route exact path={"/"} component={Login} />
              <Route exact path={"/articles"} component={ArticleList} />
              <Route exact path="/add" component={AddArticle} />
              <Route path="/articles/:id" component={Article} />
              <Route path="/login/github/callback" component={GitHubLoginCallback} />
              <Route path="/change-password" component={ChangePassword} />
            </Switch>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(App);
