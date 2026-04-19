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
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

module.exports.updateProfile = async (token, body) => {
  const response = await axios.put(`${config.providers.sau.url}/api/auth/profile`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

module.exports.logoutUser = async (token, refresh_token) => {
  const response = await axios.post(`${config.providers.sau.url}/api/auth/logout`, { refresh_token }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

module.exports.createAsset = async (token, type, value) => {
  const response = await axios.post(`${config.providers.sau.url}/api/auth/assets`, { type, value }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

module.exports.deleteAsset = async (token, id) => {
  const response = await axios.delete(`${config.providers.sau.url}/api/auth/assets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

module.exports.passwordReset = async (email) => {
  const response = await axios.post(`${config.providers.sau.url}/api/auth/password-reset`, { email });
  return response.data;
};