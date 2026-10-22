# FlightWatch ✈️

A real-time flight tracking web app. Live aircraft positions worldwide on an interactive dark map, with search, filtering, and per-flight detail — built on the OpenSky Network API.

**Live demo:** [flight-watch-three.vercel.app/](flight-watch-three.vercel.app/)

## Features

- Live worldwide flight positions on an interactive Leaflet map, auto-refreshing every 15 seconds
- Search flights by callsign or country
- Click a flight to fly to it on the map and see altitude, speed, heading, and coordinates
- Flight trajectory playback via historical track data
- File-based caching layer to stay within OpenSky's public rate limits

## Tech Stack

**Frontend**
- Next.js (App Router, TypeScript)
- Tailwind CSS
- React Leaflet / Leaflet.js for the map
- Axios

**Backend**
- Node.js + Express
- MySQL (via `mysql2`), hosted on Aiven
- Axios for OpenSky Network API requests
- File-based response caching

**Deployment**
- Backend: Render
- Frontend: Vercel

## Getting Started

### Prerequisites
- Node.js 20+
- A MySQL database (e.g. a free Aiven MySQL service)

### Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` for the database-backed saved-flight endpoints (live flights do not require MySQL):

```env
DB_HOST=your-mysql-host
DB_PORT=your-mysql-port
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
PORT=3001
```

Create the database table:

```bash
node setup.js
```

Start the server:

```bash
npm run dev
```

The API runs on `http://localhost:3001` by default.

The live feed is fetched by the backend from OpenSky. The backend now gives that request a 12-second timeout and returns a cached response when available, so a stalled upstream request cannot leave the UI loading forever.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend uses `http://localhost:3001` by default. To use a deployed backend, set `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` to its origin, for example `https://your-backend.example.com`, then restart the frontend.

The map uses OpenStreetMap standard tiles and does not need a basemapsapi.key or any other map API key. Keep the visible OpenStreetMap attribution and follow its tile usage policy.

## API Endpoints

| Method | Endpoint                      | Description                          |
|--------|--------------------------------|---------------------------------------|
| GET    | `/api/flights/live`           | Current live flight positions (cached, from OpenSky) |
| GET    | `/api/flights/track/:icao24`  | Historical flight path for an aircraft |
| GET    | `/api/flights`                | Stored flights from the database      |
| GET    | `/api/flights/:id`            | A single stored flight by ID          |
| POST   | `/api/flights`                | Create a stored flight record         |
| DELETE | `/api/flights/:id`            | Delete a stored flight record         |

## Data Source

Flight data comes from the [OpenSky Network](https://opensky-network.org) API. Anonymous access is subject to OpenSky's current availability and rate limits; if the feed is temporarily unavailable, the backend uses its last cached response when one exists.

## License

ISC
