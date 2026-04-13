// src/api/endpoints.ts

export const ENDPOINTS = {
  auth: {
    login: '/api/token/',
    refresh: '/api/token/refresh/',
    me: '/api/v1/users/me/',
  },
  system: {
    health: '/api/v1/health/',
    users: '/api/v1/users/',
  },
  lexicon: {
    public: {
      wotd: '/api/v2/lexicon/public/word-of-the-day/',
      practice: '/api/v2/lexicon/public/daily-practice/',
      search: '/api/v2/lexicon/public/search/',
      trending: '/api/v2/lexicon/public/trending/',
    },
    admin: {
      words: '/api/v2/lexicon/manager/words/',
      categories: '/api/v2/lexicon/manager/categories/',
      overrideWotd: '/api/v2/lexicon/manager/word-of-the-day/override/',
      overridePractice: '/api/v2/lexicon/manager/daily-practice/override/',
    }
  }
};
