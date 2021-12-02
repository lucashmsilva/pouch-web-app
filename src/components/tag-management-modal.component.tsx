import { Component } from "react";
import { Button, ListGroup, Modal } from 'react-bootstrap';

import TagsService from '../services/tags.service';
import ITagListData from "../types/tag-list.type";
import SmallLoadingSpinner from "./small-loading.component";

type Props = {
  articleId: number
  onTagListChange?: (tagList: ITagListData) => void
};

type State = {
  show: boolean
  wasClosed: boolean
  loading: boolean
  currentTagIndex: number
  tags: ITagListData
};

class TagMngmtModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.retrieveTags = this.retrieveTags.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.reloadPage = this.reloadPage.bind(this);

    this.state = {
      show: false,
      wasClosed: false,
      loading: false,
      currentTagIndex: -1,
      tags: {
        page: 0,
        size: 5,
        count: 0,
        pages: 0,
        tags: []
      }
    };
  }

  handleShow() {
    const { wasClosed } = this.state;
    if (!wasClosed) {
      this.retrieveTags();
    }

    this.setState({ show: true });
  }

  handleClose() {
    this.setState({
      show: false,
      wasClosed: true
    });
  }

  retrieveTags() {
    this.setState({ loading: true });

    TagsService.getAll(this.props.articleId, this.state.tags.page + 1, this.state.tags.size)
      .then(response => {
        response.data.tags = this.state.tags.tags.concat(response.data.tags);
        this.setState({
          tags: response.data
        });
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      }).finally(() => {
        this.setState({ loading: false });
      });
  }

  reloadPage(pageToReload: number) {
    const { onTagListChange } = this.props;
    const { tags } = this.state;
    const currentTagList = tags.tags
    const itemsPerPage = tags.size;
    const pageFirstIndex = pageToReload * itemsPerPage - itemsPerPage;

    TagsService.getAll(this.props.articleId, pageToReload, itemsPerPage)
      .then(response => {
        let refreshedPage = response.data.tags;
        currentTagList.splice(pageFirstIndex, itemsPerPage, ...refreshedPage);
        let uniqueTags = currentTagList.filter((v, i, a) => a.findIndex(tag => tag.id === v.id) === i);

        this.setState({
          tags: {
            ...tags,
            pages: response.data.pages,
            tags: uniqueTags
          }
        });
        console.log(response.data);

        if (onTagListChange) {
          onTagListChange(this.state.tags); // chamar qudndo criar uma nova tag
        }
      })
      .catch(err => {
        console.log(err);
      }).finally(() => {
        this.setState({ loading: false });
      });
  }

  deleteTag(tagId: number, indexOfItem: number) {
    this.setState({ currentTagIndex: indexOfItem });
    this.setState({ loading: true });

    TagsService.delete(this.props.articleId, tagId)
      .then(() => {
        this.reloadPage(Math.floor(indexOfItem / this.state.tags.size) + 1);
        this.setState({ currentTagIndex: -1 })
      });
  }


  render() {
    const { show, tags, loading, currentTagIndex } = this.state;

    return (
      <>
        <Modal show={show} onHide={this.handleClose} className="modal-autoheight" >
          <Modal.Header closeButton>
            <Modal.Title>tags</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ListGroup variant="flush">
              {tags && tags.tags.map((tagInfo, indexOfItem) => (
                <ListGroup.Item key={indexOfItem}>
                  {tagInfo.tagName}
                  {loading && indexOfItem === currentTagIndex ? (
                    <SmallLoadingSpinner />
                  ) : (
                    <div className="icon trash-can" onClick={() => this.deleteTag(tagInfo.id, indexOfItem)} />
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>

            <Button
              variant="link"
              disabled={(loading || (tags.count === 0) || (tags.page >= tags.pages))}
              onClick={this.retrieveTags}
            >
              load more
            </Button>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose} >
              close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default TagMngmtModal;
