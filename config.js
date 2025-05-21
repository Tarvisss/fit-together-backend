// config.js
// This file loads environment variables and exports app-wide settings

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: +process.env.PORT,
};
