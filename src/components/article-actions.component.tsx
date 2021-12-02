import React, { Component, RefObject } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import IUpdateArticleData from "../types/update-article.type";
import ArticleDataService from "../services/article.service";
import IArticleData from "../types/article.type";
import TagMngmtModal from "./tag-management-modal.component";
import IArticleListData from "../types/article-list.type";
import ITagListData from "../types/tag-list.type";
import SmallLoadingSpinner from "./small-loading.component";

type Props = RouteComponentProps & {
  article: IArticleData
  articleList?: IArticleListData
  onDeleteRedirectTo?: string

  onArticleDelete?: (pageToReload: number) => void
  onArticleEdit?: (newArticleData: IArticleData) => void
};

enum ARTICLE_PROPERTIES {
  FAVORITED='FAVORITED',
  ARCHIVED='ARCHIVED',
  DELETED='DELETED',
  READ='READ'
};

type State = {
  loading: { [key in keyof typeof ARTICLE_PROPERTIES]: boolean }
};


class ArticleActions extends Component<Props, State>{
  private tagsModalElement: RefObject<TagMngmtModal>

  constructor(props: Props) {
    super(props);
    this.openTagsModal = this.openTagsModal.bind(this);
    this.refreshTagsOnEdit = this.refreshTagsOnEdit.bind(this);
    this.tagsModalElement = React.createRef();

    this.state = {
      loading: {
        [ARTICLE_PROPERTIES.ARCHIVED]: false,
        [ARTICLE_PROPERTIES.DELETED]: false,
        [ARTICLE_PROPERTIES.FAVORITED]: false,
        [ARTICLE_PROPERTIES.READ]: false
      }
    };
  }

  editArticle(articleProperty: IUpdateArticleData, articleId: number, property: ARTICLE_PROPERTIES) {
    const { onArticleDelete, onArticleEdit, articleList, onDeleteRedirectTo } = this.props;
    const { loading } = this.state;

    this.setState({
      loading: {
        [ARTICLE_PROPERTIES[property]]: true
      } as typeof loading
    });

    ArticleDataService.update(articleProperty, articleId)
      .then((response) => {
        if (onArticleDelete && articleList) {
          let indexOfItem = articleList.articles.findIndex(article => article.id === articleId);
          onArticleDelete(Math.floor(indexOfItem / articleList.size) + 1);
        }

        if (onArticleEdit) {
          onArticleEdit(response.data);
        }

        if (response?.data?.deleted && !onArticleDelete && onDeleteRedirectTo) {
          this.props.history.push(onDeleteRedirectTo);
        }
      })
      .finally(() => {
        this.setState({
          loading: {
            [ARTICLE_PROPERTIES[property]]: false
          } as typeof loading
        });
      });
  }

  openTagsModal() {
    this.tagsModalElement.current?.handleShow();
  }

  refreshTagsOnEdit(tagList: ITagListData) {
    const { article, onArticleEdit } = this.props;

    if (onArticleEdit) {
      onArticleEdit({
        ...article,
        tags: tagList.tags
      })
    }
  }

  render() {
    const { article } = this.props;
    const { loading } = this.state;

    return (
      <div className="icons-list">
        <div className="icon tag-plus" onClick={this.openTagsModal} />
        {loading.FAVORITED ? <SmallLoadingSpinner /> : (<div className={`icon star ${article.favorited}`} onClick={() => this.editArticle({ favorited: !article.favorited }, article.id, ARTICLE_PROPERTIES.FAVORITED)} />)}
        {loading.ARCHIVED ? <SmallLoadingSpinner /> : (<div className={`icon archive ${article.archived}`} onClick={() => this.editArticle({ archived: !article.archived }, article.id, ARTICLE_PROPERTIES.ARCHIVED)} />)}
        {loading.DELETED ? <SmallLoadingSpinner /> : (<div className={`icon trash-can ${article.deleted}`} onClick={() => this.editArticle({ deleted: !article.deleted }, article.id, ARTICLE_PROPERTIES.DELETED)} />)}

        <TagMngmtModal ref={this.tagsModalElement} articleId={article.id} onTagListChange={this.refreshTagsOnEdit} />
      </div>
    );
  }
}

export default withRouter(ArticleActions);