"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

interface Flight {
  icao: string;
  callsign: string;
  country: string;
  longitude: number;
  latitude: number;
  altitude: number;
  velocity: number;
  heading: number;
}

function FlyTo({ selected }: { selected: Flight | null }) {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.latitude, selected.longitude], 7, { duration: 1.2 });
    }
  }, [selected, map]);
  return null;
}

export default function Map({ selected }: { selected: Flight | null }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [track, setTrack] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchFlights = () => {
      axios
        .get(`${API_BASE_URL}/api/flights/live`, { timeout: 20000 })
        .then((res) => setFlights(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error(err));
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selected?.icao) return;

    axios
      .get(
        `${API_BASE_URL}/api/flights/track/${selected.icao}`,
        { timeout: 15000 },
      )
      .then((res) => setTrack(res.data.path || []))
      .catch(() => setTrack([]));

    return () => setTrack([]);
  }, [selected]);

  const getIcon = (heading: number, highlighted: boolean) =>
    L.divIcon({
      className: "",
      html: `<div style="font-size:${highlighted ? 26 : 16}px;transform:rotate(${heading}deg);line-height:1;${highlighted ? "filter:drop-shadow(0 0 6px #60a5fa)" : ""}">✈</div>`,
      iconSize: [highlighted ? 32 : 20, highlighted ? 32 : 20],
      iconAnchor: [highlighted ? 16 : 10, highlighted ? 16 : 10],
    });

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[20, 78]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <FlyTo selected={selected} />

        {track.length > 1 && (
          <Polyline
            positions={track}
            pathOptions={{ color: "#60a5fa", weight: 2, opacity: 0.7 }}
          />
        )}

        {flights.map((f) => (
          <Marker
            key={f.icao}
            position={[f.latitude, f.longitude]}
            icon={getIcon(f.heading || 0, selected?.icao === f.icao)}
          >
            <Popup>
              <div className="text-xs font-mono">
                <p className="font-bold text-sm mb-1">
                  {f.callsign || "Unknown"}
                </p>
                <p>Country: {f.country}</p>
                <p>
                  Altitude: {f.altitude ? `${Math.round(f.altitude)}m` : "—"}
                </p>
                <p>
                  Speed:{" "}
                  {f.velocity ? `${Math.round(f.velocity * 3.6)} km/h` : "—"}
                </p>
                <p>Heading: {f.heading ? `${Math.round(f.heading)}°` : "—"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
