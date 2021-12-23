import { Component } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import queryString from 'query-string';

import AuthService from "../services/auth.service";
import ArticleDataService from "../services/article.service";
import LoadingSpinner from './loading.component';

type Props = RouteComponentProps;

type State = {}

class ShareHandlerComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.checkSession = this.checkSession.bind(this);
    this.saveArticle = this.saveArticle.bind(this);
  }

  componentDidMount() {
    this.checkSession()
      .then(() => this.saveArticle())
      .catch(() => this.props.history.push('/'));
  }

  saveArticle() {
    let params = queryString.parse(this.props.location.search);
    let { url } = params;

    return ArticleDataService.create(url as string)
      .then(response => this.props.history.push(`/articles/${response.data.id}`))
      .catch(console.log);
  }

  checkSession() {
    return AuthService.getSession()
      .then(response => {
        if (!response.data?.id) {
          throw new Error("Auth fail");
        }
        console.log(response.data);
        return;
      });
  }

  render() {
    return ( <LoadingSpinner /> );
  }
}

export default withRouter(ShareHandlerComponent);