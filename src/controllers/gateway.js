module.exports.health = async (req, res) => {
  res.json({ service: 'gateway', status: 'ok' });
}