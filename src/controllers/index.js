"use strict";

const gatewayController = require("./gateway");
const authController = require("./auth");
const shodanController = require("./shodan");
const analysisController = require("./analysis");
const alertsController = require("./alerts");
const complianceController = require("./compliance");
const reportsController = require("./reports");

// ── Gateway ───────────────────────────────────────────────────────────────────
module.exports["gateway.health"] = gatewayController.health;

// ── Auth ──────────────────────────────────────────────────────────────────────

module.exports["auth.register"] = authController.register;
module.exports["auth.login"] = authController.login;
module.exports["auth.logout"] = authController.logout;
module.exports["auth.profile.get"] = authController.profileGet;
module.exports["auth.profile.update"] = authController.profileUpdate;
module.exports["auth.assets.create"] = authController.assetsCreate;
module.exports["auth.assets.delete"] = authController.assetsDelete;
module.exports["auth.passwordReset"] = authController.passwordReset;

// ── Shodan (SCS) ──────────────────────────────────────────────────────────────

module.exports["scs.health"] = shodanController.health;
module.exports["scs.host"] = shodanController.host;
module.exports["scs.search"] = shodanController.search;
module.exports["scs.count"] = shodanController.count;
module.exports["scs.dns.domain"] = shodanController.dnsDomain;
module.exports["scs.dns.resolve"] = shodanController.dnsResolve;
module.exports["scs.alert"] = shodanController.alert;

// ── Analysis (SAR) ────────────────────────────────────────────────────────────

module.exports["sar.analyze"] = analysisController.analyze;
module.exports["sar.assets.list"] = analysisController.assetsList;
module.exports["sar.analysis.getById"] = analysisController.getById;

// ── Alerts (SAN) ──────────────────────────────────────────────────────────────

module.exports["san.alerts.list"] = alertsController.list;
module.exports["san.alerts.markRead"] = alertsController.markRead;
module.exports["san.alerts.markAllRead"] = alertsController.markAllRead;
module.exports["san.alerts.delete"] = alertsController.delete;

// ── Compliance (SCN) ──────────────────────────────────────────────────────────

module.exports["scn.evaluate"] = complianceController.evaluate;
module.exports["scn.norms.list"] = complianceController.normsList;

// ── Reports (SRE) ─────────────────────────────────────────────────────────────

module.exports["sre.report.latest"] = reportsController.latest;
module.exports["sre.report.list"] = reportsController.list;
module.exports["sre.report.generate"] = reportsController.generate;
