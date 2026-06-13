import fs from "fs";
import path from "path";
import axios from "axios";
import process from "process";
import { getAllFlights, getFlightById as fetchFlightById, createFlight as insertFlight, deleteFlight as removeFlight } from '../models/flightModel.js';

const CACHE_FILE = path.resolve("cache.json");
const CACHE_DURATION = 300000;

function readCache() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
            return data;
        }
    } catch {
        return null;
    }
    return null;
}

function writeCache(flights) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ flights, timestamp: Date.now() }));
}

export async function getLiveFlights(req, res) {
    try {
        const cached = readCache();
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return res.status(200).json(cached.flights);
        }

        const { data } = await axios.get("https://opensky-network.org/api/states/all", {
            auth: {
                username: process.env.OPENSKY_USERNAME,
                password: process.env.OPENSKY_PASSWORD
            }
        });

        if (!data.states) return res.status(200).json([]);

        const flights = data.states.map((s) => ({
            icao: s[0],
            callsign: s[1]?.trim(),
            country: s[2],
            longitude: s[5],
            latitude: s[6],
            altitude: s[7],
            velocity: s[9],
            heading: s[10],
        })).filter(f => f.latitude && f.longitude);

        writeCache(flights);
        res.status(200).json(flights);

    } catch (error) {
        console.error("LiveFlights error:", error.message);
        const cached = readCache();
        if (cached) return res.status(200).json(cached.flights);
        res.status(500).json({ message: error.message });
    }
}

export async function getFlights(req, res) {
    try {
        const flights = await getAllFlights();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getFlightTrack(req, res) {
    try {
        const { icao24 } = req.params;
        const { data } = await axios.get(`https://opensky-network.org/api/tracks/all`, {
            params: { icao24, time: 0 },
            auth: {
                username: process.env.OPENSKY_USERNAME,
                password: process.env.OPENSKY_PASSWORD
            }
        });

        const path = data.path?.map((p) => [p[1], p[2]]) || [];
        res.status(200).json({ path });
    } catch (error) {
        console.error("Track error:", error.message);
        res.status(500).json({ message: error.message, path: [] });
    }
}

export async function getFlightById(req, res) {
    try {
        const flight = await fetchFlightById(req.params.id);
        if (!flight) return res.status(404).json({ message: "Flight not found" });
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createFlight(req, res) {
    try {
        const insertId = await insertFlight(req.body);
        res.status(201).json({ message: "Flight created", flight_id: insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteFlight(req, res) {
    try {
        const affected = await removeFlight(req.params.id);
        if (!affected) return res.status(404).json({ message: "Flight not found" });
        res.status(200).json({ message: "Flight deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}