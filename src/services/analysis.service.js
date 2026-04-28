'use strict';

const shodan   = require('./shodan.service');
const Analysis = require('../models/analysis.model');

function cvssToLevel(score) {
  if (score >= 9.0) return 'critico';
  if (score >= 7.0) return 'alto';
  if (score >= 4.0) return 'medio';
  return 'bajo';
}

function globalRiskFromFindings(findings) {
  if (findings.some((f) => f.level === 'critico')) return 'critico';
  if (findings.some((f) => f.level === 'alto'))    return 'alto';
  if (findings.some((f) => f.level === 'medio'))   return 'medio';
  return 'bajo';
}

async function analyze(company_id, asset_type, asset_value) {
  let hostData;
  try {
    hostData = await shodan.getHost(asset_value);
  } catch {
    hostData = { vulns: {}, data: [] };
  }

  const rawVulns = hostData.vulns || {};
  const vulnKeys = Object.keys(rawVulns);

  const rawFindings = vulnKeys.map((cve) => {
    const v     = rawVulns[cve] || {};
    const cvss  = parseFloat(v.cvss || v.cvss_v3 || 0);
    return {
      type:           cve,
      description:    v.summary || `Vulnerability ${cve}`,
      cvss_score:     cvss,
      level:          cvssToLevel(cvss),
      affected_asset: asset_value,
      recommendation: v.references?.[0] || 'Apply latest security patches',
    };
  });

  const maxCvss     = rawFindings.reduce((max, f) => Math.max(max, f.cvss_score), 0);
  const globalRisk  = globalRiskFromFindings(rawFindings.length ? rawFindings : [{ level: 'bajo' }]);

  const analysis = await Analysis.createAnalysis({
    company_id,
    asset_type,
    asset_value,
    global_risk: globalRisk,
    max_cvss:    maxCvss,
  });

  const findings = await Promise.all(
    rawFindings.map((f) => Analysis.createFinding({ analysis_id: analysis.id, ...f }))
  );

  return buildResult(analysis, findings);
}

async function getById(id) {
  const analysis = await Analysis.findAnalysisById(id);
  if (!analysis) {
    const err = new Error('Analysis not found');
    err.status = 404;
    throw err;
  }
  const findings = await Analysis.findFindingsByAnalysis(id);
  return buildResult(analysis, findings);
}

function buildResult(analysis, findings) {
  return {
    analysisId:  analysis.id,
    ip:          analysis.asset_value,
    globalRisk:  analysis.global_risk,
    maxCvss:     parseFloat(analysis.max_cvss),
    analyzedAt:  analysis.analyzed_at,
    findings:    findings.map((f) => ({
      id:            f.id,
      type:          f.type,
      description:   f.description,
      cvssScore:     parseFloat(f.cvss_score),
      level:         f.level,
      affectedAsset: f.affected_asset,
      recommendation: f.recommendation,
    })),
  };
}

module.exports = { analyze, getById };
