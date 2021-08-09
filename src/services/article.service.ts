import http from "../http-common";
import IListFiltersData from "../types/list-filters.type";
import IUpdateArticleData from "../types/update-article.type";

class ArticleDataService {
  getAll(filters?: IListFiltersData) {
    return http.get("/article", { params: filters });
  }

  create(articleUrl: string) {
    return http.post("/article", { url: articleUrl });
  }

  get(id: number) {
    return http.get(`/article/${id}`);
  }

  update(data: IUpdateArticleData, id: any) {
    return http.put(`/article/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/article/${id}`);
  }
}

export default new ArticleDataService();