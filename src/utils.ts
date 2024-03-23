import moment from 'moment';

const BASE_URL =
  import.meta.env.VITE_CURRENT_ENV === 'prod'
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_DEV_URL;

const API_HEADER = {
  headers: {
    apiKey: import.meta.env.VITE_API_KEY,
  },
};

function formatDate(dt: string) {
  return moment(dt).format('D MMM, YYYY hh:mm a');
}

export { BASE_URL, API_HEADER, formatDate };
