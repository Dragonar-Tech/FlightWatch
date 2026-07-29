# FlightWatch ✈️

A real-time flight tracking web app. Live aircraft positions worldwide on an interactive dark map, with search, filtering, and per-flight detail — built on the OpenSky Network API.

**Live demo:** [flight-watch-alpha.vercel.app](https://flight-watch-alpha.vercel.app)

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

Create a `.env` file in `backend/`:

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

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Note: the frontend currently points at the deployed Render backend URL. To run fully local end-to-end, update the API base URL in `components/FlightTable.tsx` and `components/Map.tsx`.

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

Flight data comes from the [OpenSky Network](https://opensky-network.org) public API, accessed anonymously (subject to their public rate limits).

## License

ISC
