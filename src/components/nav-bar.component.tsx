import React, { Component, RefObject } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import AuthService from "../services/auth.service";
import AddArticleModal from "./add-article-modal.component";

type ExtraProps = {
  setLoading: (isLoading: boolean) => void
  hideMenus: boolean
}

type Props = RouteComponentProps & ExtraProps;

type State = {
  loading: boolean
};

class NavBar extends Component<Props, State> {
  private addArticleModalElement: RefObject<AddArticleModal>

  constructor(props: Props) {
    super(props);
    this.addArticleModalElement = React.createRef();
    this.logout = this.logout.bind(this);
    this.moveToAddedArticle = this.moveToAddedArticle.bind(this);

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

  moveToAddedArticle(articleId: number) {
    this.props.history.push(`/articles/${articleId}`);
  }

  render() {
    const { hideMenus } = this.props;
    return (
      <>
        <nav className="navbar navbar-expand ">
          <Link to={"/articles"} className="navbar-brand">
            <strong><p>pouch</p></strong>
          </Link>

          <div className={`navbar-nav mr-auto ${hideMenus ? 'd-none' : ''}`}>
            <li className="nav-item">
              <NavDropdown id="sections-menu" title="sections" >
                <NavDropdown.Item onClick={() => this.props.history.push('/articles')}>reading list</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => this.props.history.push('/articles/archived')}>archive</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => this.props.history.push('/articles/favorited')}>favorited</NavDropdown.Item>
              </NavDropdown>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => this.addArticleModalElement.current?.handleShow()}>add</div>
            </li>
          </div>

          <div className={`navbar-nav ml-auto ${hideMenus ? 'd-none' : ''}`}>
            <NavDropdown id="options-menu" title="options" >
              <NavDropdown.Item onClick={() => this.props.history.push('/change-password')}>change password</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.logout}>logout</NavDropdown.Item>
            </NavDropdown>
          </div>
        </nav>

        <AddArticleModal ref={this.addArticleModalElement} onArticleAdded={this.moveToAddedArticle} />
      </>
    );
  }
}

export default withRouter(NavBar);
