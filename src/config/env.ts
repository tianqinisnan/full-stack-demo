const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || '8888';
const BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

export const env = {
  api: {
    baseURL: BASE_URL,
  },
  assets: {
    baseURL: BASE_URL,
  },
}; 