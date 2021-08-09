import { Component, ChangeEvent } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import ArticleDataService from "../services/article.service";
import AuthService from "../services/auth.service";
import LoadingSpinner from './loading.component';

type Props = RouteComponentProps;

type State = {
  url: string
  loading: boolean
  loadingCheckingSession: boolean
};

class AddArticle extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeUrlInput = this.onChangeUrlInput.bind(this);
    this.checkSession = this.checkSession.bind(this);
    this.saveArticle = this.saveArticle.bind(this);

    this.state = {
      url: '',
      loading: false,
      loadingCheckingSession: false
    };
  }

  componentDidMount() {
    this.checkSession();
  }

  onChangeUrlInput(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      url: e.target.value
    });
  }

  saveArticle() {
    this.setState({ loading: true });
    ArticleDataService.create(this.state.url)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        this.setState({ loading: false, url: '' });
      });
  }

  checkSession() {
    this.setState({ loadingCheckingSession: true });
    AuthService.getUser()
      .then(response => {
        if (!response.data?.id) {
          this.props.history.push('/');
        } else {
          this.setState({ loadingCheckingSession: false });
        }

        console.log(response.data);
      })
      .catch(error => {
        this.props.history.push('/');
      });
  }

  render() {
    const { url, loading, loadingCheckingSession } = this.state;
    return (
      <div>
        {loadingCheckingSession ? (
          <LoadingSpinner />
        ) : (
          <div className="submit-form">
            <div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  required
                  value={url}
                  onChange={this.onChangeUrlInput}
                  name="title"
                  placeholder="url for new article"
                />
              </div>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <button onClick={this.saveArticle} className="btn btn-success">
                  save
                </button>
              )}

            </div>
          </div>

        )}
      </div>
    );
  }
}

export default withRouter(AddArticle);
