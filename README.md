# CiberShield API

API REST de monitoreo de ciberseguridad para PYMEs colombianas. Centraliza autenticación, escaneo de activos mediante Shodan, análisis de riesgos CVE, alertas, cumplimiento normativo (ISO 27001, Circular 052 SFC, Ley 1581) y reportes ejecutivos.

## Stack

- **Runtime**: Node.js ≥ 20
- **Framework**: Express 4 + OpenAPI 3 (express-openapi-validator)
- **Base de datos**: PostgreSQL (Railway)
- **Auth**: JWT — access token (1h) + refresh token (7d)
- **API externa**: Shodan API

## Requisitos

- Node.js 20+
- PostgreSQL (base de datos `railway` — local o Railway.app)
- API Key de Shodan

## Instalación

```bash
git clone <repo>
cd cibershield
npm install
cp .env.example .env
# edita .env con tus credenciales
npm run dev
```

## Variables de entorno

```env
# Servidor
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=*

# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/railway
DB_SSL=true          # true para Railway, false para local sin SSL

# JWT
JWT_SECRET=min-32-caracteres
JWT_REFRESH_SECRET=min-32-caracteres
JWT_ACCESS_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Shodan
SHODAN_API_KEY=tu-api-key
```

> Las tablas se crean automáticamente al iniciar el servidor (`CREATE TABLE IF NOT EXISTS`).

## Scripts

```bash
npm run dev    # desarrollo con hot-reload (node --watch)
npm start      # producción
```

## Documentación interactiva

Con el servidor corriendo, abre:

```
http://localhost:3000/docs/
```

Swagger UI con todos los endpoints, esquemas y ejemplos. En producción:

```
https://cibershield-production.up.railway.app/docs/
```

## Endpoints

### Auth (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro de empresa y usuario admin |
| POST | `/api/auth/login` | No | Login — retorna access + refresh token |
| POST | `/api/auth/logout` | Sí | Invalida el refresh token |
| GET | `/api/auth/profile` | Sí | Perfil del usuario y activos registrados |
| PUT | `/api/auth/profile` | Sí | Actualiza nombre de empresa y sector |
| POST | `/api/auth/assets` | Sí | Registra un activo (IP, CIDR, dominio, subdominio) |
| DELETE | `/api/auth/assets/{id}` | Sí | Elimina un activo |
| POST | `/api/auth/password-reset` | No | Solicita recuperación de contraseña |

### Shodan — SCS (`/api/scs`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/scs/health` | Estado del conector Shodan |
| POST | `/api/scs/host` | Info de un host por IP |
| POST | `/api/scs/search` | Búsqueda libre con paginación |
| POST | `/api/scs/count` | Conteo de resultados sin consumir créditos |
| POST | `/api/scs/dns/domain` | Subdominios e IPs de un dominio |
| POST | `/api/scs/dns/resolve` | Resolución DNS masiva (hostnames → IPs) |
| POST | `/api/scs/alert` | Crea alerta de monitoreo en Shodan |

### Análisis de Riesgos — SAR (`/api/sar`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/sar/analyze` | Analiza un activo via Shodan y guarda hallazgos CVE |
| GET | `/api/sar/assets` | Resumen de riesgos de todos los activos de la empresa |
| GET | `/api/sar/analysis/{id}` | Detalle completo de un análisis por ID |

### Alertas — SAN (`/api/san`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/san/alerts` | Lista alertas de la empresa (filtro `unread`, paginación) |
| PUT | `/api/san/alerts/{id}/read` | Marca una alerta como leída |
| PUT | `/api/san/alerts/read-all` | Marca todas las alertas como leídas |
| DELETE | `/api/san/alerts/{id}` | Elimina una alerta |

### Cumplimiento — SCN (`/api/scn`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/scn/evaluate` | Evalúa hallazgos contra normas del sector |
| GET | `/api/scn/norms` | Lista las normas disponibles (ISO 27001, Circular 052 SFC, Ley 1581) |

### Reportes — SRE (`/api/sre`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/sre/report/latest` | Último reporte de la empresa |
| GET | `/api/sre/report/list` | Historial de reportes |
| POST | `/api/sre/report/generate` | Genera y persiste un nuevo reporte |

### Sistema

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/ping` | Ping con uptime |
| GET | `/ready` | Readiness probe |

## Autenticación

Todos los endpoints marcados con **Auth: Sí** requieren el header:

```
Authorization: Bearer <access_token>
```

El `company_id` del usuario se extrae del token JWT — no se pasa por URL.

## Flujo básico

```
1. POST /api/auth/register   → access_token + refresh_token
2. POST /api/auth/assets     → registrar IP o dominio a monitorear
3. POST /api/sar/analyze     → analiza el activo via Shodan (guarda CVEs)
4. POST /api/scn/evaluate    → evalúa cumplimiento con los hallazgos
5. POST /api/sre/report/generate → genera reporte ejecutivo
6. GET  /api/san/alerts      → consulta alertas generadas
```

## Estructura del proyecto

```
src/
├── index.js                  # Entry point — inicializa servidor y seguridad JWT
├── config.js                 # Variables de entorno
├── lib/                      # Framework HTTP interno
│   ├── server.js             # Servidor Express con OpenAPI validation
│   ├── router.js             # Registro de rutas desde el spec
│   ├── logger.js             # Logger estructurado JSON
│   ├── errors.js             # Clases de error HTTP
│   ├── middleware/
│   │   ├── context.js        # transactionId + req.logger
│   │   └── errors.js         # Error handler global
│   └── endpoints/
│       ├── docs.js           # Swagger UI
│       ├── ping.js           # /ping
│       └── ready.js          # /ready
├── database/
│   ├── index.js              # Pool de conexiones pg
│   └── migrate.js            # Migraciones (CREATE TABLE IF NOT EXISTS)
├── models/                   # Queries SQL por entidad
│   ├── user.model.js
│   ├── company.model.js
│   ├── asset.model.js
│   ├── alert.model.js
│   ├── refresh_token.model.js
│   ├── analysis.model.js
│   └── report.model.js
├── services/                 # Lógica de negocio
│   ├── auth.service.js       # Registro, login, tokens JWT
│   ├── shodan.service.js     # Cliente Shodan API
│   └── analysis.service.js  # Análisis de riesgos CVE
├── controllers/              # Handlers HTTP por módulo
│   ├── index.js              # Mapa operationId → función
│   ├── gateway.js
│   ├── auth.js
│   ├── shodan.js
│   ├── analysis.js
│   ├── alerts.js
│   ├── compliance.js
│   └── reports.js
└── openapi/
    └── openapi.yml           # Especificación OpenAPI 3.0.3
```

## Base de datos

Tablas creadas automáticamente:

| Tabla | Descripción |
|-------|-------------|
| `companies` | Empresas registradas |
| `users` | Usuarios con referencia a empresa |
| `refresh_tokens` | Tokens de refresco (hashed SHA-256) |
| `assets` | Activos monitoreados (IP, CIDR, dominio, subdominio) |
| `alerts` | Alertas de seguridad por empresa |
| `analysis_results` | Resultados de análisis de riesgo |
| `findings` | Hallazgos CVE por análisis |
| `reports` | Reportes ejecutivos generados |

## Despliegue en Railway

1. Conecta el repositorio en [railway.app](https://railway.app)
2. Agrega un servicio PostgreSQL — Railway provee `DATABASE_URL` automáticamente
3. Configura las variables de entorno en Railway (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `SHODAN_API_KEY`, `DB_SSL=true`)
4. El servidor inicia con `npm start` y crea las tablas automáticamente
