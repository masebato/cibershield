"use strict";

module.exports = {
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  swaggerUrl: "/docs",

  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/cibershield",
    poolMax: parseInt(process.env.DB_POOL_MAX || "10", 10),
    ssl: process.env.DB_SSL === "true",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "changeme-jwt-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "changeme-refresh-secret",
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "1h",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },

  shodan: {
    apiKey: process.env.SHODAN_API_KEY || "",
  },
};
