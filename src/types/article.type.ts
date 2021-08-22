import IArticleContentData from "./article-content.type";
import ITagData from "./tag.type";

export default interface IArticleData {
  id: number
  originalUrl: string
  readingTime: number
  contentId: number
  isReadable: boolean
  read: boolean
  archived: boolean
  favorited: boolean
  deleted: boolean
  createdAt: Date
  updatedAt: Date

  articleContent: IArticleContentData
  tags?: ITagData[]
}