import moment from 'moment';
import { ConfettiProps } from 'react-confetti-explosion';

const BASE_URL =
  import.meta.env.VITE_CURRENT_ENV === 'prod'
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_DEV_URL;

const API_HEADER = {
  headers: {
    apiKey: import.meta.env.VITE_API_KEY,
  },
};

const largeExplosion: ConfettiProps = {
  zIndex: -1,
  force: 0.8,
  width: 1600,
  duration: 3000,
  particleCount: 300,
  colors: [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
  ],
};

function formatDate(dt: string) {
  return moment(dt).format('D MMM, YYYY hh:mm a');
}

export { BASE_URL, API_HEADER, largeExplosion, formatDate };
