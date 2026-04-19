'use strict';

const sau = require('../providers/provider.sau');

const token = (req) => req.headers.authorization?.replace('Bearer ', '');

const handleError = (res, err) => {
  if (err.response) return res.status(err.response.status).json(err.response.data);
  return res.status(500).json({ error: err.message });
};

module.exports.register = async (req, res) => {
  try {
    const { email, password, company_name, sector } = req.body;
    const data = await sau.registerUser(email, password, company_name, sector);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await sau.loginUser(email, password);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const data = await sau.logoutUser(token(req), refresh_token);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.profileGet = async (req, res) => {
  try {
    const data = await sau.getUserProfile(token(req));
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.profileUpdate = async (req, res) => {
  try {
    const data = await sau.updateProfile(token(req), req.body);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.assetsCreate = async (req, res) => {
  try {
    const { type, value } = req.body;
    const data = await sau.createAsset(token(req), type, value);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.assetsDelete = async (req, res) => {
  try {
    const data = await sau.deleteAsset(token(req), req.params.id);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports.passwordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await sau.passwordReset(email);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};
