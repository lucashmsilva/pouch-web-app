import ITagData from "../types/tag.type";

export default interface ITagListData {
  page: number,
  size: number,
  count: number,
  pages: number,
  tags: ITagData[]
}