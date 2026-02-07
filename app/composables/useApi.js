const API_ENDPOINTS = {
  articles: "/api",
};

class Request {
  constructor() {
    this.baseURL = useRuntimeConfig().public.baseUrl;
    this.headers = {};
  }

  fetch(url, method, options) {
    this.headers = {
      "Content-type": "application/json",
    };

    return useFetch(url, {
      baseURL: this.baseURL,
      method: method,
      headers: this.headers,
      ...options,
    });
  }

  get(url, options) {
    return this.fetch(url, "GET", options);
  }
  post(url, options) {
    return this.fetch(url, "POST", options);
  }
  put(url, options) {
    return this.fetch(url, "PUT", options);
  }
  patch(url, options) {
    return this.fetch(url, "PATCH", options);
  }
  delete(url, options) {
    return this.fetch(url, "DELETE", options);
  }
}

class CMSManager {
  constructor(request) {
    this.request = request;
  }

  async getDataPageHome(data) {
    return this.request.get(
      `${API_ENDPOINTS.articles}/homepage-sections`,
      data,
    );
  }

  async getDataCategoryHome(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/categories/home`, data);
  }

  async getArticles(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/articles`, data);
  }
  async getArticlesDetail(slug) {
    return this.request.get(`${API_ENDPOINTS.articles}/articles/${slug}`);
  }
  async getArticleCategories(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/categories`, data);
  }

  async getArticleFeatured(data) {
    return this.request.get(
      `${API_ENDPOINTS.articles}/articles/featured`,
      data,
    );
  }

  async getArticleCategoryBySlug(slug) {
    return this.request.get(`${API_ENDPOINTS.articles}/categories/${slug}`);
  }

  async getArticleTagsarticles(slug, data) {
    return this.request.get(`${API_ENDPOINTS.articles}/tags/${slug}`, data);
  }

  async getArticleTags(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/tags`, data);
  }

  async getFAQ(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/faqs`, data);
  }

  async getSearch(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/nations`, data);
  }

  async getAllArticles(data) {
    return this.request.get(`${API_ENDPOINTS.articles}/articles/all`, data);
  }
}

class RestAPI {
  constructor() {
    this.request = new Request();
    this.articles = new CMSManager(this.request);
  }
}

export default () => ({ restAPI: new RestAPI() });
