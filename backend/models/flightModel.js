import db from '../config/db.js';

export async function getAllFlights() {
    const [rows] = await db.query("SELECT * FROM FLIGHTS");
    return rows;
}

export async function getFlightById(id) {
    const [rows] = await db.query(
        "SELECT * FROM FLIGHTS WHERE flight_id = ?",
        [id]
    );
    return rows[0];
}

export const createFlight = async (data) => {
    const { flight_number, airline, departure_airport_id, arrival_airport_id, scheduled_departure, scheduled_arrival } = data;
    const [result] = await db.query(
        "INSERT INTO FLIGHTS (flight_number, airline, departure_airport_id, arrival_airport_id, scheduled_departure, scheduled_arrival) VALUES (?,?,?,?,?,?)",
        [flight_number, airline, departure_airport_id, arrival_airport_id, scheduled_departure, scheduled_arrival]
    );
    return result.insertId;
};

export const deleteFlight = async (id) => {
    const [result] = await db.query("DELETE FROM FLIGHTS WHERE flight_id = ?", [id]);
    return result.affectedRows;
};