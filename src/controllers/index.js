'use strict';

const gatewayController = require('./gateway');
const authController    = require('./auth');
const scsController     = require('./scs');
const sarController     = require('./sar');
const sanController     = require('./san');
const scnController     = require('./scn');
const sreController     = require('./sre');

// ── Gateway ───────────────────────────────────────────────────────────────────
module.exports['gateway.health'] = gatewayController.health;

// ── Auth (SAU) ────────────────────────────────────────────────────────────────
module.exports['auth.register']       = authController.register;
module.exports['auth.login']          = authController.login;
module.exports['auth.logout']         = authController.logout;
module.exports['auth.profile.get']    = authController.profileGet;
module.exports['auth.profile.update'] = authController.profileUpdate;
module.exports['auth.assets.create']  = authController.assetsCreate;
module.exports['auth.assets.delete']  = authController.assetsDelete;
module.exports['auth.passwordReset']  = authController.passwordReset;

// ── Shodan Connector (SCS) ────────────────────────────────────────────────────
module.exports['scs.health']      = scsController.health;
module.exports['scs.host']        = scsController.host;
module.exports['scs.search']      = scsController.search;
module.exports['scs.count']       = scsController.count;
module.exports['scs.dns.domain']  = scsController.dnsDomain;
module.exports['scs.dns.resolve'] = scsController.dnsResolve;
module.exports['scs.alert']       = scsController.alert;

// ── Risk Analysis (SAR) ───────────────────────────────────────────────────────
module.exports['sar.analyze']          = sarController.analyze;
module.exports['sar.assets.list']      = sarController.listAssets;
module.exports['sar.analysis.getById'] = sarController.getById;

// ── Alerts & Notifications (SAN) ──────────────────────────────────────────────
module.exports['san.alerts.list']        = sanController.listAlerts;
module.exports['san.alerts.markRead']    = sanController.markRead;
module.exports['san.alerts.markAllRead'] = sanController.markAllRead;
module.exports['san.alerts.delete']      = sanController.deleteAlert;

// ── Compliance (SCN) ──────────────────────────────────────────────────────────
module.exports['scn.evaluate']   = scnController.evaluate;
module.exports['scn.norms.list'] = scnController.listNorms;

// ── Executive Reports (SRE) ───────────────────────────────────────────────────
module.exports['sre.report.list']     = sreController.listReports;
module.exports['sre.report.generate'] = sreController.generateReport;
module.exports['sre.report.latest']   = sreController.latestReport;
