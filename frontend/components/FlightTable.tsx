"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

interface Flight {
  icao: string;
  callsign: string;
  country: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
}

interface Props {
  selected: Flight | null;
  onSelect: (flight: Flight | null) => void;
}

export default function FlightTable({ selected, onSelect }: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchFlights = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_BASE_URL}/api/flights/live`, { timeout: 20000 });
        if (active) setFlights(Array.isArray(response.data) ? response.data : []);
      } catch {
        if (active) setError("Could not load flights. Check that the backend is running, then retry.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchFlights();
    return () => { active = false; };
  }, [retryCount]);

  const filtered = flights.filter(
    (f) =>
      f.callsign?.toLowerCase().includes(search.toLowerCase()) ||
      f.country?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="search callsign or country..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSelect(null);
        }}
        className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-blue-500/60 backdrop-blur-md transition"
      />

      {selected && (
        <div className="bg-white/5 border border-blue-500/30 rounded-md px-3 py-3 text-xs backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold text-sm">
              {selected.callsign || "Unknown"}
            </span>
            <button
              onClick={() => onSelect(null)}
              className="text-white/30 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
            <span className="text-white/40">Country</span>
            <span className="text-white">{selected.country}</span>
            <span className="text-white/40">Altitude</span>
            <span className="text-white">
              {selected.altitude ? `${Math.round(selected.altitude)}m` : "—"}
            </span>
            <span className="text-white/40">Speed</span>
            <span className="text-white">
              {selected.velocity
                ? `${Math.round(selected.velocity * 3.6)} km/h`
                : "—"}
            </span>
            <span className="text-white/40">Heading</span>
            <span className="text-white">
              {selected.heading ? `${Math.round(selected.heading)}°` : "—"}
            </span>
            <span className="text-white/40">Latitude</span>
            <span className="text-white">{selected.latitude?.toFixed(4)}</span>
            <span className="text-white/40">Longitude</span>
            <span className="text-white">{selected.longitude?.toFixed(4)}</span>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-white/30 text-xs px-1">fetching flights...</p>
      )}
      {!loading && error && (
        <div className="text-xs px-1 text-amber-200">
          <p>{error}</p>
          <button onClick={() => setRetryCount((count) => count + 1)} className="mt-1 underline">Retry</button>
        </div>
      )}
      {!loading && !error && search && filtered.length === 0 && (
        <p className="text-white/30 text-xs px-1">no results.</p>
      )}
      {!loading && !error && search && filtered.length > 0 && (
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
          {filtered.slice(0, 20).map((f) => (
            <div
              key={f.icao}
              onClick={() => onSelect(f)}
              className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-md px-3 py-2 text-xs transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">
                  {f.callsign || "—"}
                </span>
                <span className="text-white/40 text-[10px]">{f.country}</span>
              </div>
              <div className="text-white/30 text-[10px] mt-0.5">
                {f.altitude ? `${Math.round(f.altitude)}m` : "—"} ·{" "}
                {f.velocity ? `${Math.round(f.velocity * 3.6)} km/h` : "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && !search && (
        <p className="text-white/20 text-[10px] px-1">
          {flights.length} flights tracked worldwide
        </p>
      )}
    </div>
  );
}
