import { Component } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import queryString from 'query-string';

import AuthService from "../services/auth.service";
import LoadingSpinner from './loading.component';

type Props = RouteComponentProps;

type State = { loading: boolean }

class GitHubLoginCallback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);

    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    let params = queryString.parse(this.props.location.search);
    let { code } = params;

    this.setState({ loading: true });
    AuthService.githubLogin({ code })
      .then((response) => {
        console.log(response.data);
        this.props.history.push('/articles');
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push('/');
      });
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div> </div>
        )}
      </div>
    );
  }
}

export default withRouter(GitHubLoginCallback);