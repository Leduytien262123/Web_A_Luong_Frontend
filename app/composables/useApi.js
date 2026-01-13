import { ref } from "vue";

function createResponse(payload) {
  return { data: ref(payload) };
}

function buildCategories() {
  const top = [
    {
      id: 1,
      name: "Asia",
      slug: "asia",
      parent_id: null,
      position: 1,
      visible_nav: 1,
      visible_footer: 1,
    },
    {
      id: 2,
      name: "Europe",
      slug: "europe",
      parent_id: null,
      position: 2,
      visible_nav: 1,
      visible_footer: 1,
    },
  ];

  const second = [
    {
      id: 3,
      name: "Japan",
      slug: "japan",
      parent_id: 1,
      position: 1,
      visible_nav: 1,
      visible_footer: 1,
    },
    {
      id: 4,
      name: "Korea",
      slug: "korea",
      parent_id: 1,
      position: 2,
      visible_nav: 1,
      visible_footer: 1,
    },
    {
      id: 5,
      name: "UK",
      slug: "uk",
      parent_id: 2,
      position: 1,
      visible_nav: 1,
      visible_footer: 1,
    },
  ];

  const third = [
    {
      id: 6,
      name: "Tokyo",
      slug: "tokyo",
      parent_id: 3,
      position: 1,
      visible_nav: 1,
      visible_footer: 0,
    },
    {
      id: 7,
      name: "Seoul",
      slug: "seoul",
      parent_id: 4,
      position: 1,
      visible_nav: 1,
      visible_footer: 0,
    },
    {
      id: 8,
      name: "London",
      slug: "london",
      parent_id: 5,
      position: 1,
      visible_nav: 1,
      visible_footer: 0,
    },
  ];

  return [...top, ...second, ...third];
}

const mockCategories = buildCategories();
const mockSearch = mockCategories.map((item) => ({
  name: item.name,
  slug: item.slug,
  scope: "sim-du-lich",
}));

const mockFeedbacks = [
  {
    id: 1,
    name: "Customer 1",
    content: "Great service and fast support.",
  },
  {
    id: 2,
    name: "Customer 2",
    content: "Coverage was stable during the whole trip.",
  },
];

const mockFaq = [
  {
    id: 1,
    question: "How do I activate the eSIM?",
    answer:
      "After purchase you receive a QR code. Scan it and follow the on-device activation guide.",
    position: 1,
  },
  {
    id: 2,
    question: "How long does the plan last?",
    answer: "We offer options from 5 to 30 days so you can pick what you need.",
    position: 2,
  },
];

const mockNews = [
  {
    id: 1,
    name: "Travel tips for Japan",
    slug: "travel-tips-japan",
    published_at: "2024-05-01",
    feature_image: [{ src: "/img/empty.jpg", alt: "news" }],
    description: "Things to remember when buying eSIM in Japan.",
  },
  {
    id: 2,
    name: "Visit Korea easily",
    slug: "visit-korea",
    published_at: "2024-06-15",
    feature_image: [{ src: "/img/empty.jpg", alt: "news" }],
    description: "Five-day itinerary and data tips for Korea.",
  },
];

const mockPartners = Array.from({ length: 8 }).map((_, index) => ({
  id: index + 1,
  image: "/img/empty.jpg",
  alt: "partner",
}));

const mockCart = {
  error: false,
  data: {
    items: [],
    total: 0,
  },
};

export default function useApi() {
  const restAPI = {
    stores: {
      async getStoreProductCategories() {
        return createResponse({
          data: mockCategories,
          count: mockCategories.length,
        });
      },
      async getSearch() {
        return createResponse({ data: mockSearch, error: false });
      },
      async getCustomer() {
        return createResponse(mockCart);
      },
      async updateCustomer() {
        return createResponse({ error: false });
      },
      async getFeedbacks() {
        return createResponse({
          data: mockFeedbacks,
          count: mockFeedbacks.length,
        });
      },
      async getFAQ() {
        return createResponse({ data: mockFaq });
      },
      async getBlogs() {
        return createResponse({ data: mockNews, count: mockNews.length });
      },
      async getPartners() {
        return createResponse({
          data: mockPartners,
          count: mockPartners.length,
        });
      },
    },
  };

  return { restAPI };
}
