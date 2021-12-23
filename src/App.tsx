import { Component } from "react";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { UnregisterCallback } from "history";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import NavBar from "./components/nav-bar.component";
import AddArticle from "./components/add-article.component";
import Article from "./components/article.component";
import ArticleList from "./components/article-list.component";
import Login from "./components/login.component";
import GitHubLoginCallback from "./components/github-login-callback.component";
import ChangePassword from "./components/change-password.component";
import ResetPassword from "./components/reset-password.component";
import ShareHandlerComponent from "./components/share-handler.component";

import LoadingSpinner from "./components/loading.component";

const HIDE_NAV_BAR_ROUTES = ['/', '/login/github/callback', '/reset-password'];

type Props = RouteComponentProps;

type State = {
  loading: boolean
  hideNavBarMenus: boolean
};

class App extends Component<Props, State> {
  private unlistenHistory: UnregisterCallback;

  constructor(props: Props) {
    super(props);

    this.setLoading = this.setLoading.bind(this);
    this.unlistenHistory = () => null;

    this.state = {
      loading: false,
      hideNavBarMenus: true
    };

  }

  setLoading(isLoading: boolean) {
    this.setState({
      loading: isLoading
    })
  }

  setHideNavBarMenus(isHiding: boolean) {
    const { hideNavBarMenus } = this.state;
    if (hideNavBarMenus !== isHiding) {
      this.setState({
        hideNavBarMenus: isHiding
      });
    }
  }

  componentDidMount() {
    this.props.history.listen = this.props.history.listen.bind(this);

    const shouldHideNavbarMenus = HIDE_NAV_BAR_ROUTES.includes(window.location.pathname);
    this.setHideNavBarMenus(shouldHideNavbarMenus);

    this.unlistenHistory = this.props.history.listen(location => {
      const destinationPath = location.pathname;
      const shouldHideNavbarMenus = HIDE_NAV_BAR_ROUTES.includes(destinationPath);
      this.setHideNavBarMenus(shouldHideNavbarMenus);
    });
  }

  componentWillUnmount() {
    this.unlistenHistory();
  }

  render() {
    const { loading, hideNavBarMenus } = this.state;

    return (
      <div>

        <NavBar setLoading={this.setLoading} hideMenus={hideNavBarMenus} />

        <div className="container mt-3">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Switch>
              <Route exact path={"/"} component={Login} />
              <Route exact path="/login/github/callback" component={GitHubLoginCallback} />

              <Route exact path={"/articles"} component={ArticleList} />
              <Route exact path="/add" component={AddArticle} />
              <Route exact path="/articles/:id" component={Article} />

              <Route exact path="/change-password" component={ChangePassword} />
              <Route exact path="/reset-password" component={ResetPassword} />

              <Route exact path="/share-handler" component={ShareHandlerComponent} />
            </Switch>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(App);
