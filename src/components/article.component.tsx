import { Component } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';

import ArticleDataService from "../services/article.service";
import IArticleData from "../types/article.type";
import LoadingSpinner from './loading.component';
import AticleActions from "./article-actions.component";
import TagList from "./tag-list.component";

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentArticle: IArticleData
  loading: boolean
  lastScrollPostion: string | null
}

class Article extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.getArticle = this.getArticle.bind(this);
    this.reloadArticleData = this.reloadArticleData.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      currentArticle: {
        id: 0,
        originalUrl: '',
        readingTime: 0,
        contentId: 0,
        isReadable: false,
        read: false,
        archived: false,
        favorited: false,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        articleContent: {
          id: 0,
          title: '',
          excerpt: '',
          content: '',
          createdAt: new Date(0),
          updatedAt: new Date(0),
        },
        tags: [],
      },
      loading: false,
      lastScrollPostion: null
    };
  }

  componentDidMount() {
    this.getArticle(this.props.match.params.id);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getArticle(id: string) {
    this.setState({ loading: true });
    return ArticleDataService.get(+id)
      .then((response) => {
        if (!response.data.isReadable) {
          window.open(response.data.originalUrl, "_blank");
          this.props.history.push('/articles');
        } else if (response.data) {
          this.setState({
            currentArticle: response.data,
          });
          this.setState({ loading: false });
          const lastScrollPostion = localStorage.getItem(`articleScrollPos:${response.data.id}`);
          if (lastScrollPostion) {
            window.scrollTo(0, +lastScrollPostion);
          }
        } else {
          this.props.history.push('/articles');
        }
        console.log(response.data);
      })
      .catch((err) => {
        if (err.response?.data?.error?.extra?.name === 'missing_user') {
          this.props.history.push('/');
        } else {
          this.setState({ loading: false });
        }
      });
  }

  reloadArticleData(updatedArticleData: IArticleData) {
    this.setState({ currentArticle: { ...this.state.currentArticle, ...updatedArticleData } });
  }

  handleScroll() {
    const { currentArticle } = this.state;
    localStorage.setItem(`articleScrollPos:${currentArticle.id}`, window.scrollY.toString());
  }

  render() {
    const { currentArticle, loading } = this.state;

    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="article">
            <h1><strong>{currentArticle.articleContent.title}</strong></h1>
            <div className="article-metadata">
              <span>{Math.ceil(currentArticle.readingTime / 60000)} minutes read - <a href={currentArticle.originalUrl} target="_blank" rel="noreferrer">Original</a></span>
              <div className="article-metadata inner">
                <TagList tags={currentArticle.tags} />
                <AticleActions article={currentArticle} onArticleEdit={this.reloadArticleData} onDeleteRedirectTo={'/articles'} />
              </div>
            </div>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: currentArticle.articleContent?.content || currentArticle.originalUrl }} />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Article);