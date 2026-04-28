"use strict";

const authService = require("../services/auth.service");
const AssetModel = require("../models/asset.model");

module.exports.register = async (req, res) => {
  const { email, password, company_name, sector } = req.body;
  const result = await authService.register({
    email,
    password,
    company_name,
    sector,
  });
  res.json(result);
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.json(result);
};

module.exports.logout = async (req, res) => {
  const { refresh_token } = req.body;
  await authService.logout(refresh_token);
  res.json({ message: "Sesión cerrada correctamente" });
};

module.exports.profileGet = async (req, res) => {
  const profile = await authService.getProfile(req.user.sub);
  res.json(profile);
};

module.exports.profileUpdate = async (req, res) => {
  const { company_name, sector } = req.body;
  const profile = await authService.updateProfile(req.user.sub, {
    company_name,
    sector,
  });
  res.json(profile);
};

module.exports.assetsCreate = async (req, res) => {
  const { type, value } = req.body;
  const asset = await AssetModel.create({
    company_id: req.user.company_id,
    type,
    value,
  });
  res.json({
    id: asset.id,
    type: asset.type,
    value: asset.value,
    created_at: asset.created_at,
  });
};

module.exports.assetsDelete = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = await AssetModel.remove(id, req.user.company_id);
  if (!deleted) {
    return res
      .status(400)
      .json({ error: "Asset not found or not owned by company" });
  }
  res.json({ message: "Activo eliminado correctamente" });
};

module.exports.passwordReset = async (req, res) => {
  res.json({
    message: "Si el correo existe, recibirá instrucciones de recuperación",
  });
};
