import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import ArticleDataService from "../services/article.service";
import IArticleData from '../types/article.type';
import IArticleListData from "../types/article-list.type";
import LoadingSpinner from './loading.component';
import ArticleActions from "./article-actions.component";
import TagList from "./tag-list.component";

type Props = RouteComponentProps;

type State = {
  articles: IArticleListData
  currentIndex: number
  loading: boolean
  showEmptyListInfo: boolean
};

const MAX_EXERPT_LENGTH = 150;

class ArticleList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveArticles = this.retrieveArticles.bind(this);
    this.highlightItem = this.highlightItem.bind(this);
    this.openArticle = this.openArticle.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
    this.reloadSingleArticleData = this.reloadSingleArticleData.bind(this);

    this.state = {
      articles: {
        page: -1,
        pages: 0,
        count: 0,
        size: 10,
        articles: [],
      },
      currentIndex: -1,
      loading: false,
      showEmptyListInfo: false
    };
  }

  componentDidMount() {
    this.retrieveArticles(false);
  }

  retrieveArticles(ignoreLoading: boolean) {
    this.setState({ loading: true && !ignoreLoading });
    ArticleDataService.getAll({ page: this.state.articles.page + 1, size: this.state.articles.size })
      .then(response => {
        response.data.articles = this.state.articles.articles.concat(response.data.articles);
        this.setState({
          articles: response.data,
          loading: false
        });

        if (response.data.articles.length === 0) {
          this.setState({ showEmptyListInfo: true });
        }
        console.log(response.data);
      })
      .catch(err => {
        if (err.response?.data?.error?.extra?.name === 'missing_user') {
          this.props.history.push('/');
        } else {
          this.setState({ loading: false });
        }
      });
  }

  reloadPage(pageToReload: number) {
    const { articles } = this.state;
    const currentArticleList = articles.articles
    const itemsPerPage = articles.size;
    const pageFirstIndex = pageToReload * itemsPerPage - itemsPerPage;

    ArticleDataService.getAll({ page: pageToReload, size: this.state.articles.size })
      .then(response => {
        let refreshedPage = response.data.articles;
        currentArticleList.splice(pageFirstIndex, itemsPerPage, ...refreshedPage);
        let uniqueArticles = currentArticleList.filter((v, i, a) => a.findIndex(tag => tag.id === v.id) === i);

        this.setState({
          articles: {
            ...articles,
            articles: uniqueArticles
          }
        });

        if (uniqueArticles.length === 0) {
          this.setState({ showEmptyListInfo: true });
        }
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      }).finally(() => {
        this.setState({ loading: false });
      });
  }

  reloadSingleArticleData(updatedArticleData: IArticleData) {
    const { articles } = this.state;
    let indexOfItem = articles.articles.findIndex(article => article.id === updatedArticleData.id);

    articles.articles[indexOfItem] = { ...articles.articles[indexOfItem], ...updatedArticleData };

    this.setState({ articles });
  }

  highlightItem(index: number) {
    this.setState({ currentIndex: index });
  }

  openArticle(articleId: number, isReadable: boolean, originalUrl: string) {
    if (isReadable) {
      this.props.history.push(`/articles/${articleId}`);
    } else {
      window.open(originalUrl, "_blank");
    }
  }

  render() {
    const { articles, currentIndex, loading, showEmptyListInfo } = this.state;

    return (
      <>
        {showEmptyListInfo ? (
          <div>
            <h5>looks like you have no links saved or visible here.</h5>
            <h5>
              install our web extension (<a href="https://addons.mozilla.org/firefox/addon/pouch-web-extension/" target="_blank" rel="noreferrer">for firefox</a> and chrome comming soon) or click "add" up there, to save a link to an article in your pouch.
            </h5>
          </div>
        ) : (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div>
                <ul className="article-list list-group">
                  <InfiniteScroll
                    dataLength={this.state.articles.articles.length}
                    next={() => this.retrieveArticles(true)}
                    hasMore={this.state.articles.page !== this.state.articles.pages && this.state.articles.pages > 0}
                    loader={<LoadingSpinner />}
                  >
                    {articles && articles.articles.map((article: IArticleData, index: number) => (
                      <li
                        className={`article-list list-group-item ${index === currentIndex ? "active" : ""}`}
                        key={index}
                        onMouseEnter={() => this.highlightItem(index)}
                        onMouseLeave={() => this.highlightItem(-1)}
                      >
                        <h4
                          className="article-item"
                          onClick={() => this.openArticle(article.id, article.isReadable, article.originalUrl)}
                        >
                          <strong>{article.articleContent?.title}</strong>
                        </h4>
                        <div>{article.articleContent.excerpt?.length > MAX_EXERPT_LENGTH ? `${article.articleContent?.excerpt.slice(0, MAX_EXERPT_LENGTH)} [...]` : article.articleContent.excerpt}</div>
                        <div className="article-metadata">
                          <TagList tags={article.tags} />
                          <ArticleActions article={article} onArticleDelete={this.reloadPage} onArticleEdit={this.reloadSingleArticleData} articleList={articles} />
                        </div>
                      </li>
                    ))}
                  </InfiniteScroll>
                </ul>
              </div>
            )}
          </div>
        )}
      </>
    );
  }
}

export default withRouter(ArticleList);