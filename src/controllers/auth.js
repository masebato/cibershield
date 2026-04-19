'use strict';

const sau = require('../providers/provider.sau');

module.exports.register = async (req, res) => {
  const { email, password, company_name, sector } = req.body;
  const data = await sau.registerUser(email, password, company_name, sector);
  res.json(data);
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const data = await sau.loginUser(email, password);
  res.json(data);
};

module.exports.logout = async (req, res) => {
  const { token } = req.context();
  const { refresh_token } = req.body;
  const data = await sau.logoutUser(token, refresh_token);
  res.json(data);
};

module.exports.profileGet = async (req, res) => {
  const { token } = req.context();
  const data = await sau.getUserProfile(token);
  res.json(data);
};

module.exports.profileUpdate = async (req, res) => {
  const { token } = req.context();
  const data = await sau.updateProfile(token, req.body);
  res.json(data);
};

module.exports.assetsCreate = async (req, res) => {
  const { token } = req.context();
  const { type, value } = req.body;
  const data = await sau.createAsset(token, type, value);
  res.json(data);
};

module.exports.assetsDelete = async (req, res) => {
  const { token, params } = req.context();
  const data = await sau.deleteAsset(token, params.id);
  res.json(data);
};

module.exports.passwordReset = async (req, res) => {
  const { email } = req.body;
  const data = await sau.passwordReset(email);
  res.json(data);
};
