export default interface IListFiltersData {
  read?: boolean
  archived?: boolean
  deleted?: boolean
  favorited?: boolean
  tags?: string[]
  startDate?: Date
  endDate?: Date
  sortField?: string
  sortOrder?: string
  size?: number
  page?: number
  keywords?: string
  filterMergingOperator?: string
}