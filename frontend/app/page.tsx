import FlightMap from "@/components/FlightMap";
import FlightTable from "@/components/FlightTable";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]">
      <FlightMap />
      <div className="absolute top-5 left-5 z-[1000] flex flex-col gap-3 w-72">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">✈</span>
          <h1 className="text-white text-sm font-bold tracking-widest uppercase">
            FlightWatch
          </h1>
        </div>
        <FlightTable />
      </div>
    </main>
  );
}
