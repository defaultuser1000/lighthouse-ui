export const APP_NAME = "Lighthouse Film Lab";
export const APP_VERSION = "1.0.0";

export const USERS_FETCH_LINK = "https://www.mocky.io/v2/5e542a8b2e00007c002db21d?mocky-delay=3000ms";
export const ORDERS_FETCH_LINK = "https://www.mocky.io/v2/5e66755f310000510023a027?mocky-delay=3000ms";
export const ORDER_1_FETCH_LINK = "http://www.mocky.io/v2/5e66860e310000ee8123a129?mocky-delay=3000ms";

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
export const config = process.env.NODE_ENV === "production" ? prod : local;