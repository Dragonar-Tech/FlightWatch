"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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

export default function Map() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const fetchFlights = () => {
      axios
        .get("https://flightwatch-3.onrender.com/api/flights/live")
        .then((res) => setFlights(res.data))
        .catch((err) => console.error(err));
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 15000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (heading: number) =>
    L.divIcon({
      className: "",
      html: `<div style="font-size:16px;transform:rotate(${heading}deg);line-height:1">✈</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CARTO"
        />
        {flights.map((f) => (
          <Marker
            key={f.icao}
            position={[f.latitude, f.longitude]}
            icon={getIcon(f.heading || 0)}
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
