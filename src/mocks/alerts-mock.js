'use strict';

const ALERT_TEMPLATES = [
  {
    type: 'vulnerability_detected',
    risk_level: 'critico',
    summaries: [
      'Se detectó vulnerabilidad CVE-2019-0708 (CVSS 9.8) — BlueKeep RCE en RDP expuesto',
      'Se detectó vulnerabilidad CVE-2020-0796 (CVSS 10.0) — SMBv3 Remote Code Execution activo',
      'Se detectó vulnerabilidad CVE-2022-22965 (CVSS 9.8) — Spring4Shell permite ejecución remota de código',
      'Se detectó vulnerabilidad CVE-2021-44228 (CVSS 10.0) — Log4Shell presente en servicio Java expuesto',
    ],
  },
  {
    type: 'vulnerability_detected',
    risk_level: 'alto',
    summaries: [
      'Se detectó vulnerabilidad CVE-2023-44487 (CVSS 7.5) — HTTP/2 Rapid Reset DoS en servidor web',
      'Se detectó vulnerabilidad CVE-2021-41773 (CVSS 7.5) — Path traversal en Apache 2.4.49',
      'Se detectó vulnerabilidad CVE-2015-3306 (CVSS 10.0) — ProFTPD mod_copy expone ejecución de comandos',
      'Se detectó vulnerabilidad CVE-2018-11776 (CVSS 8.1) — Apache Struts RCE sin autenticación',
    ],
  },
  {
    type: 'new_port_open',
    risk_level: 'alto',
    summaries: [
      'Puerto 3389 (RDP) detectado expuesto a internet en el host',
      'Puerto 445 (SMB) accesible públicamente — riesgo de movimiento lateral',
      'Puerto 23 (Telnet) abierto — protocolo sin cifrado detectado en producción',
      'Puerto 5900 (VNC) expuesto sin autenticación aparente',
    ],
  },
  {
    type: 'new_port_open',
    risk_level: 'medio',
    summaries: [
      'Puerto 8080 (HTTP alternativo) abierto — posible panel de administración expuesto',
      'Puerto 27017 (MongoDB) detectado sin autenticación configurada',
      'Puerto 6379 (Redis) accesible desde redes externas',
      'Puerto 9200 (Elasticsearch) respondiendo sin credenciales',
    ],
  },
  {
    type: 'suspicious_traffic',
    risk_level: 'alto',
    summaries: [
      'Tráfico de escaneo masivo detectado originado desde el host — posible compromiso',
      'Comunicaciones salientes a dominio C2 conocido detectadas',
      'Pico inusual de tráfico UDP saliente — posible amplificación DNS',
      'Conexiones repetidas a IPs en lista negra de amenazas',
    ],
  },
  {
    type: 'suspicious_traffic',
    risk_level: 'medio',
    summaries: [
      'Tráfico fuera de horario laboral detectado hacia servicios externos inusuales',
      'Transferencia de datos inusualmente grande hacia IP desconocida',
      'Incremento del 300% en peticiones salientes en los últimos 30 minutos',
    ],
  },
  {
    type: 'failed_login_attempt',
    risk_level: 'alto',
    summaries: [
      'Más de 500 intentos de autenticación fallidos detectados en los últimos 15 minutos (ataque de fuerza bruta)',
      'Intentos de login con credenciales por defecto detectados en SSH (root/admin/test)',
      'Múltiples IPs distintas intentando acceso al panel de administración (credential stuffing)',
    ],
  },
  {
    type: 'failed_login_attempt',
    risk_level: 'medio',
    summaries: [
      '50 intentos de autenticación fallidos desde la misma IP en los últimos 10 minutos',
      'Intentos de acceso con usuario administrador bloqueado reactivado detectados',
    ],
  },
  {
    type: 'unauthorized_access',
    risk_level: 'critico',
    summaries: [
      'Acceso exitoso desde IP geolocalizada fuera del país — posible cuenta comprometida',
      'Autenticación desde dispositivo nuevo combinada con acceso a datos sensibles',
      'Acceso a recursos protegidos sin pasar por flujo de autenticación estándar',
    ],
  },
  {
    type: 'certificate_expiry',
    risk_level: 'medio',
    summaries: [
      'Certificado TLS vence en menos de 14 días — riesgo de interrupción del servicio',
      'Certificado SSL expirado detectado en servidor de producción',
      'Certificado autofirmado detectado en endpoint accesible públicamente',
    ],
  },
  {
    type: 'certificate_expiry',
    risk_level: 'bajo',
    summaries: [
      'Certificado TLS vence en 30 días — renovación recomendada',
      'Algoritmo de firma SHA-1 detectado en certificado activo (obsoleto)',
    ],
  },
  {
    type: 'config_change',
    risk_level: 'medio',
    summaries: [
      'Cambio en reglas de firewall detectado fuera del proceso de cambio autorizado',
      'Política de contraseñas modificada sin aprobación registrada',
      'Nuevo usuario administrador creado sin ticket de solicitud asociado',
    ],
  },
];

const MOCK_ASSETS = [
  '181.58.100.42',
  '190.24.135.77',
  '200.118.56.14',
  '186.28.91.203',
  '181.132.60.9',
  '190.85.44.123',
  '200.24.194.88',
  '186.155.8.231',
  '181.78.32.66',
  'api.mock-empresa.co',
  'portal.mock-empresa.co',
  'mail.mock-empresa.co',
  'vpn.mock-empresa.co',
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildRandomAlert(company_id, assets = []) {
  const pool     = assets.length > 0 ? assets : MOCK_ASSETS;
  const template = randomItem(ALERT_TEMPLATES);
  const asset    = randomItem(pool);
  const summary  = randomItem(template.summaries);

  return {
    company_id,
    type:       template.type,
    asset,
    risk_level: template.risk_level,
    summary:    `${summary} en ${asset}`,
  };
}

module.exports = { buildRandomAlert };
