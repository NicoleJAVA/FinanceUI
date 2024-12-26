import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:7007',
});

export default instance;