import express from "express";
import { getFlights, getFlightById, createFlight, deleteFlight, getLiveFlights } from "../controllers/flightController.js";

const router = express.Router();

router.get("/", getFlights);
router.get("/live", getLiveFlights);
router.get("/:id", getFlightById);
router.post("/", createFlight);
router.delete("/:id", deleteFlight);

export default router;