import { Component } from "react";
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

import TagsService from '../services/tags.service';
import ITagListData from "../types/tag-list.type";
import ITagData from "../types/tag.type";
import LoadingSpinner from "./loading.component";
import TagList from "./tag-list.component";

type Props = {
  articleId: number
  onTagListChange?: (tagList: ITagListData) => void
};

type State = {
  show: boolean
  wasClosed: boolean
  loading: boolean
  currentTagIndex: number
  newTags: ITagData[]
  newTagName: string | undefined
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
    this.addNewTags = this.addNewTags.bind(this);
    this.appendNewTagBuffer = this.appendNewTagBuffer.bind(this)
    this.resetLoadedTags = this.resetLoadedTags.bind(this);
    this.removeTagFromBuffer = this.removeTagFromBuffer.bind(this);

    this.state = {
      show: false,
      wasClosed: false,
      loading: false,
      currentTagIndex: -1,
      newTags: [],
      newTagName: '',
      tags: {
        page: 0,
        size: 10,
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

    return TagsService.getAll(this.props.articleId, this.state.tags.page + 1, this.state.tags.size)
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

  deleteTag(indexOfItem: number, tagId?: number) {
    this.setState({ currentTagIndex: indexOfItem });
    this.setState({ loading: true });

    return TagsService.delete(tagId as number, this.props.articleId)
      .then(() => {
        console.log('delete');
        this.reloadPage(Math.floor(indexOfItem / this.state.tags.size) + 1);
        this.setState({ currentTagIndex: -1 });
      });
  }

  addNewTags() {
    const { articleId, onTagListChange } = this.props;
    const { newTags } = this.state;
    this.setState({ loading: true });

    this.resetLoadedTags();

    TagsService.create(articleId, newTags.map(tag => tag.tagName))
      .then(() => {
        return this.retrieveTags();

      })
      .then(() => {
        if (onTagListChange) {
          onTagListChange(this.state.tags);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  resetLoadedTags() {
    this.setState({
      wasClosed: false,
      currentTagIndex: -1,
      newTags: [],
      newTagName: '',
      tags: {
        page: 0,
        size: 10,
        count: 0,
        pages: 0,
        tags: []
      }
    });
  }

  appendNewTagBuffer() {
    const { newTags, newTagName } = this.state;
    this.setState({ newTagName: '' });

    if (!newTagName || newTagName.trim() === '') {
      return;
    }

    let tagAlreadAdded = newTags.find(tag => tag.tagName === newTagName.trim());

    if (tagAlreadAdded) {
      return;
    }

    this.setState({ newTags: newTags.concat([{ tagName: newTagName as string }]) });
  }

  removeTagFromBuffer(indexOfItem: number) {
    const { newTags } = this.state;
    newTags.splice(indexOfItem, 1);
    this.setState({ newTags: newTags });
  }

  render() {
    const { show, tags, loading, newTags, newTagName } = this.state;

    return (
      <>
        <Modal show={show} onHide={this.handleClose} className="modal-autoheight" >
          <Modal.Header closeButton>
            <Modal.Title>tags</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="new-tags-form">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="new tag name"
                  aria-describedby="inputGroupAppend"
                  onChange={e => this.setState({ newTagName: e.target.value })}
                  value={newTagName}
                  required
                />

                <InputGroup.Append id="inputGroupAppend" placeholder="new tag name" >
                  <Button variant="secondary" onClick={this.appendNewTagBuffer} type="submit" >
                    add
                  </Button>
                </InputGroup.Append>

              </InputGroup>
              <TagList tags={newTags} warp={true} onDelete={this.removeTagFromBuffer} showDeleteIcon={true} />
              <Button className="submit-new-tags" variant="primary" onClick={this.addNewTags}>
                save new tags
              </Button>
            </Form.Group>
            <>
            </>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <TagList tags={tags.tags} warp={true} onDelete={this.deleteTag} showDeleteIcon={true} />
                <Button
                  variant="link"
                  hidden={(loading || (tags.count === 0) || (tags.page >= tags.pages))}
                  onClick={this.retrieveTags}
                >
                  load more
                </Button>
              </>
            )}
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
