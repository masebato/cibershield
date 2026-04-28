'use strict';

const NORMS = [
  { id: 'ISO-A.12.6.1', norm: 'ISO 27001', title: 'Gestión de vulnerabilidades técnicas', sector: '*', description: 'Control de vulnerabilidades en sistemas de información' },
  { id: 'ISO-A.13.1.1', norm: 'ISO 27001', title: 'Controles de red', sector: '*', description: 'Gestión de seguridad en redes' },
  { id: 'SFC-052-3.1',  norm: 'Circular 052 SFC', title: 'Gestión de riesgos de seguridad', sector: 'fintech', description: 'Requerimientos de seguridad para entidades financieras' },
  { id: 'COL-RGPD-1',   norm: 'Ley 1581', title: 'Protección de datos personales', sector: '*', description: 'Cumplimiento de protección de datos en Colombia' },
];

function evaluateFinding(finding) {
  const observations = [];

  if (finding.cvssScore >= 7.0) {
    observations.push({
      ruleId:         'ISO-A.12.6.1',
      norm:           'ISO 27001',
      title:          'Gestión de vulnerabilidades técnicas',
      compliant:      false,
      findingRef:     finding.id,
      observation:    `Vulnerabilidad ${finding.type} con CVSS ${finding.cvssScore} no corregida`,
      recommendation: finding.recommendation,
    });
  }

  if (finding.level === 'critico' || finding.level === 'alto') {
    observations.push({
      ruleId:         'SFC-052-3.1',
      norm:           'Circular 052 SFC',
      title:          'Gestión de riesgos de seguridad',
      compliant:      false,
      findingRef:     finding.id,
      observation:    `Riesgo ${finding.level} detectado en ${finding.affectedAsset}`,
      recommendation: finding.recommendation,
    });
  }

  return observations;
}

module.exports.evaluate = async (req, res) => {
  const { findings, sector } = req.body;

  const allObservations = findings.flatMap(evaluateFinding);
  const nonCompliant    = allObservations.filter((o) => !o.compliant).length;
  const compliant       = allObservations.filter((o) => o.compliant).length;

  let complianceStatus = 'compliant';
  if (nonCompliant > 0 && compliant === 0)      complianceStatus = 'non_compliant';
  else if (nonCompliant > 0)                    complianceStatus = 'partial';

  res.json({
    sector:            sector || 'general',
    complianceStatus,
    nonCompliantCount: nonCompliant,
    compliantCount:    compliant,
    observations:      allObservations,
  });
};

module.exports.normsList = async (req, res) => {
  res.json(NORMS);
};
