// db.js
const { PrismaClient } = require("../generated/prisma");

const db = new PrismaClient(); // Will use DATABASE_URL from current env

module.exports = db;

