const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || '8888';

export const env = {
  api: {
    baseURL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  },
}; 