import IArticleData from "./article.type"; "./article.type";

export default interface IArticleListData {
  page: number
  pages: number
  count: number
  size: number
  articles: IArticleData[]
}