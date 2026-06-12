import "dotenv/config";
import mysql from "mysql2/promise";
import process from "process";

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

await connection.query(`
CREATE TABLE IF NOT EXISTS FLIGHTS (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20),
    airline VARCHAR(100),
    departure_airport_id INT,
    arrival_airport_id INT,
    scheduled_departure DATETIME,
    scheduled_arrival DATETIME
)
`);

console.log("Tables created successfully");
await connection.end();