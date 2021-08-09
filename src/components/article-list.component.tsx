import { Component } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import ArticleDataService from "../services/article.service";
import IArticleData from '../types/article.type';
import IArticleListData from "../types/article-list.type";
import LoadingSpinner from './loading.component';
import IconList from "./icon-list.component";
import TagList from "./tag-list.component";

type Props = RouteComponentProps;

type State = {
  articles: IArticleListData
  currentIndex: number
  loading: boolean
};

const MAX_EXERPT_LENGTH = 150;

class ArticleList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveArticles = this.retrieveArticles.bind(this);
    this.highlightItem = this.highlightItem.bind(this);

    this.state = {
      articles: {
        page: 0,
        pages: 0,
        count: 0,
        size: 0,
        articles: [],
      },
      currentIndex: -1,
      loading: false
    };
  }

  componentDidMount() {
    this.retrieveArticles(false);
  }

  retrieveArticles(ignoreLoading: boolean) {
    this.setState({ loading: true && !ignoreLoading });
    ArticleDataService.getAll({ page: this.state.articles.page + 1, size: 10 })
      .then(response => {
        response.data.articles = this.state.articles.articles.concat(response.data.articles);
        this.setState({
          articles: response.data
        });
        this.setState({ loading: false });
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

  highlightItem(index: number) {
    this.setState({ currentIndex: index });
  }

  render() {
    const { articles, currentIndex, loading } = this.state;

    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <ul className="list-group">
              <InfiniteScroll
                dataLength={this.state.articles.count}
                next={() => this.retrieveArticles(true)}
                hasMore={this.state.articles.page !== this.state.articles.pages}
                loader={<LoadingSpinner />}
              >
                {articles && articles.articles.map((article: IArticleData, index: number) => (
                  <li
                    className={`list-group-item ${index === currentIndex ? "active" : ""}`}
                    key={index}
                    onMouseEnter={() => this.highlightItem(index)}
                    onMouseLeave={() => this.highlightItem(-1)}
                  >
                    <Link
                      className="deco-none"
                      to={`/articles/${article.id}`}
                      onClick={() => this.highlightItem(index)}
                    >
                      <h4>{article.title}</h4>
                    </Link>
                    <div>{article.excerpt?.length > MAX_EXERPT_LENGTH ? `${article.excerpt.slice(0, MAX_EXERPT_LENGTH)} [...]` : article.excerpt}</div>
                    <div className="article-metadata">
                      <TagList tags={article.tags} />
                      <IconList article={article} />
                    </div>
                  </li>
                ))}
              </InfiniteScroll>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(ArticleList);