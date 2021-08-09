import IArticleContentData from "./article-content.type";
import ITagData from "./tag.type";

export default interface IArticleData {
  id: number
  title: string
  excerpt: string
  originalUrl: string
  readingTime: number
  contentId: number
  read: boolean
  archived: boolean
  favorited: boolean
  deleted: boolean
  createdAt: Date
  updatedAt: Date

  articleContent?: IArticleContentData
  tags?: ITagData[]
}