import axios from 'axios';

const API_BASE_URL = 'http://your-api-url.com';

export const fetchTransactions = async (month, search = '', page = 1) => {
  return await axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, search, page },
  });
};

export const fetchStatistics = async (month) => {
  return await axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChartData = async (month) => {
  return await axios.get(`${API_BASE_URL}/chart-data`, { params: { month } });
};