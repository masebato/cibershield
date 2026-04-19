const axios = require('axios');
const config = require('../config');


module.exports.registerUser = async (email, password, company_name, sector) => {
  const response = await axios.post(`${config.providers.sau.url}/api/auth/register`, {
    email,
    password,
    company_name,
    sector,
  });
  return response.data;
}

module.exports.loginUser = async (email, password) => {
  const response = await axios.post(`${config.providers.sau.url}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
}

module.exports.getUserProfile = async (token) => {
  const response = await axios.get(`${config.providers.sau.url}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}