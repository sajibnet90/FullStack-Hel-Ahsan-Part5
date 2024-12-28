// services/login.js
import axios from 'axios';
const baseUrl = '/api/login';
//const baseUrl = 'http://localhost:3001/api/login'; // for development server 

const login = async (credentials) => {
  console.log('Login service started');
  console.log('Sending login request:', credentials);
  const response = await axios.post(baseUrl, credentials);
  console.log('Login response received:', response.data);
  return response.data;
};

export default { login };
