import { Component } from "react";

import IUpdateArticleData from "../types/update-article.type";
import ArticleDataService from "../services/article.service";
import IArticleData from "../types/article.type";

type Props = {
    article: IArticleData
};

type State = {};

export default class IconList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    editArticle(articleProperty: IUpdateArticleData, articleId: number) {
        ArticleDataService.update(articleProperty, articleId)
        // .then(() => {
        //   this.state.articles.articles[index].
        // });
    }

    render() {
        const { article } = this.props;
        return (
            <div className="icons-list">
                <div className="icon tag-plus" />
                <div className={`icon star ${article.favorited}`} onClick={() => this.editArticle({ favorited: !article.favorited }, article.id)} />
                <div className={`icon archive ${article.archived}`} onClick={() => this.editArticle({ archived: !article.archived }, article.id)} />
                <div className={`icon trash-can ${article.deleted}`} onClick={() => this.editArticle({ deleted: !article.deleted }, article.id)} />
            </div>
        );
    }
}