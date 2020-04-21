require('dotenv').config();

export const APP_NAME = "Lighthouse Film Lab";
export const APP_VERSION = "1.0.0";

const local = {
  url: {
      API_URL: "http://localhost:8080"
  }
};
const dev = {
    url: {
        API_URL: "https://lighthouse-back-dev.herokuapp.com"
    }
};
const staging = {
    url: {
        API_URL: "https://lighthouse-back-staging.herokuapp.com"
    }
};
const prod = {
    url: {
        API_URL: "https://lighthouse-back-production.herokuapp.com"
    }
};
export const config = process.env.STAND === "production" ? prod
    : process.env.STAND === "development" ? dev
        : process.env.STAND === "staging" ? staging
            : local;