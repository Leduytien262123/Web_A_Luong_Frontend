const API_ENDPOINTS = {
  articles: {
    articles: "/articles",
  },
  admin: {
    tags: "/admin/tags",
    faqs: "/admin/faqs",
  },
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

  async getArticles(data) {
    return this.request.get(
      `${API_ENDPOINTS.articles.articles}/articles`,
      data
    );
  }
  async getArticlesDetail(slug) {
    return this.request.get(`${API_ENDPOINTS.articles.articles}/${slug}`);
  }
  async getArticleCategories(data) {
    return this.request.get(
      `${API_ENDPOINTS.articles.articles}/categories`,
      data
    );
  }

  async getArticleCategoryBySlug(slug) {
    return this.request.get(
      `${API_ENDPOINTS.articles.articles}/categories/${slug}`
    );
  }

  async getArticleTagsarticles(slug, data) {
    return this.request.get(
      `${API_ENDPOINTS.articles.articles}/tags/${slug}`,
      data
    );
  }

  async getArticleTags(data) {
    return this.request.get(`${API_ENDPOINTS.admin.tags}`, data);
  }

  async getFAQ(data) {
    return this.request.get(`${API_ENDPOINTS.admin.faqs}`, data);
  }

  async getSearch(data) {
    return this.request.get(`${API_ENDPOINTS.articles.articles}/nations`, data);
  }
}

class RestAPI {
  constructor() {
    this.request = new Request();
    this.articles = new CMSManager(this.request);
    this.admin = new CMSManager(this.request);
  }
}

export default () => ({ restAPI: new RestAPI() });
