"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

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

export default function FlightMap({ selected }: { selected: Flight | null }) {
  return <Map selected={selected} />;
}
