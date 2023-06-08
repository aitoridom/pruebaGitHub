require("dotenv").config(); // Metemos las variables del .env

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production"; // miramos si está en production (True) o en development (False)

const connectionString = `postgresql://${process.env.DB_USER}:${ process.env.DB_PASSWORD}@${process.env.DB_HOST}:${ process.env.DB_PORT}/${ process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

module.exports = { pool };