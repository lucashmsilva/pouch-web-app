import { Component } from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';

import ArticleDataService from "../services/article.service";
import IArticleData from "../types/article.type";
import LoadingSpinner from './loading.component';
import IconList from "./icon-list.component";
import TagList from "./tag-list.component";

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentArticle: IArticleData
  loading: boolean
}

class Article extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.getArticle = this.getArticle.bind(this);

    this.state = {
      currentArticle: {
        id: 0,
        originalUrl: '',
        readingTime: 0,
        contentId: 0,
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
      loading: false
    };
  }

  componentDidMount() {
    this.getArticle(this.props.match.params.id);
  }

  getArticle(id: string) {
    this.setState({ loading: true });
    ArticleDataService.get(+id)
      .then((response) => {
        if (response.data) {
          this.setState({
            currentArticle: response.data,
          });
          this.setState({ loading: false });
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
              <TagList tags={currentArticle.tags} />
              <IconList article={currentArticle} />
            </div>
            <hr/>
            <div dangerouslySetInnerHTML={{ __html: currentArticle.articleContent?.content || currentArticle.originalUrl }} />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Article);