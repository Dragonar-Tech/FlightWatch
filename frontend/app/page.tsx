"use client";
import { useState } from "react";
import FlightMap from "@/components/FlightMap";
import FlightTable from "@/components/FlightTable";

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

export default function Home() {
  const [selected, setSelected] = useState<Flight | null>(null);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]">
      <FlightMap selected={selected} />
      <div className="absolute top-5 left-5 z-[1000] flex flex-col gap-3 w-72">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">✈</span>
          <h1 className="text-white text-sm font-bold tracking-widest uppercase">
            FlightWatch
          </h1>
        </div>
        <FlightTable selected={selected} onSelect={setSelected} />
      </div>
    </main>
  );
}
