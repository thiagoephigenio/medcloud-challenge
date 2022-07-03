import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://g0knvd8hhi.execute-api.sa-east-1.amazonaws.com/api',
  // withCredentials: true,
});
export const apiSearchAddress = axios.create({
  baseURL: 'https://viacep.com.br/ws'
});
