import { ChangeEvent, Component } from "react";
import { Button, Modal } from 'react-bootstrap';

import LoadingSpinner from "./loading.component";
import ArticleDataService from "../services/article.service";

type Props = {
  onArticleAdded: (articleId: number) => void
};

type State = {
  show: boolean
  url: string
  loading: boolean
  loadingCheckingSession: boolean
};

class AddArticleModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeUrlInput = this.onChangeUrlInput.bind(this);
    this.saveArticle = this.saveArticle.bind(this);

    this.state = {
      show: false,
      url: '',
      loading: false,
      loadingCheckingSession: false
    };
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  onChangeUrlInput(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      url: e.target.value
    });
  }

  saveArticle() {
    const { url } = this.state;

    if (url.trim() === '') {
      return;
    }

    this.setState({ loading: true });
    ArticleDataService.create(this.state.url)
      .then(response => {
        console.log(response.data);
        this.setState({ loading: false, url: '', show: false });
        this.props.onArticleAdded(response.data.id);
      })
      .catch(e => {
        this.setState({ loading: false, url: '', show: false });
        console.log(e);
      });
  }

  render() {
    const { show, loading, url } = this.state;

    return (
      <>
        <Modal show={show} onHide={this.handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>add article</Modal.Title>
          </Modal.Header>

          <Modal.Body>
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
          </Modal.Body>

          <Modal.Footer>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Button variant="secondary" onClick={this.handleClose} >
                  close
                </Button>
                <Button
                  disabled={url.trim() === ''}
                  variant="primary"
                  onClick={this.saveArticle}>
                  save
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AddArticleModal;
