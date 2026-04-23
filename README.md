# fullstack-app-docker

A full stack dockerized application with a React (Vite) frontend, Express backend powered by Bun, and MongoDB database. Deployable locally via Docker Compose and to production on Railway.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + Vite |
| **Backend** | Express.js running on Bun |
| **Database** | MongoDB + Mongoose |
| **Containerization** | Docker + Docker Compose |
| **Deployment** | Railway |

---

## Project Structure

```
fullstack-app-docker/
├── express-container/       # Backend — Express.js + Bun
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env                 # local only, gitignored
├── react-container/         # Frontend — React + Vite
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── .env                 # local only, gitignored
├── docker-compose.yml
└── .gitignore
```

---

## Environment Variables

### Backend — `express-container/.env`

```env
MONGO_URI=mongodb://mongo:27017/mydocker
PORT=3000
```

### Frontend — `react-container/.env`

```env
VITE_API_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` files. Both are in `.gitignore`. Use the `.env.example` files as templates.

---

## Running Locally

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/masterabdullah95/fullstack-app-docker.git
cd fullstack-app-docker

# 2. Create .env files (see Environment Variables section above)

# 3. Build and start all containers
docker-compose up --build
```

### Services

| Service | URL |
|---|---|
| **Frontend** | http://localhost:5173 |
| **Backend** | http://localhost:3000 |
| **MongoDB** | mongodb://localhost:27017 |

### Stop containers

```bash
docker-compose down

# To also remove volumes (clears MongoDB data)
docker-compose down -v
```

---

## How Docker Compose Works

All three services run on the same Docker network (`fullstack-net`) so they can communicate by container name:

```
react-container  →  express-container  →  mongo
(port 5173)          (port 3000)           (port 27017)
```

```yaml
services:
  server:    # Express backend
  client:    # React frontend
  mongo:     # MongoDB
```

Containers communicate internally using container names, e.g.:
- Backend connects to MongoDB via `mongodb://mongo:27017` — **not** `localhost`
- Frontend connects to backend via `VITE_API_URL` — baked in at build time by Vite

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/items` | Fetch all items |
| `POST` | `/items` | Add a new item |

### Example — Add item

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item"}'
```

### Example — Get all items

```bash
curl http://localhost:3000/items
```

---

## Deployment on Railway

Railway does not support Docker Compose. Each service is deployed separately using its own `Dockerfile`.

### Architecture on Railway

```
Railway Project
├── frontend service   (react-container/)
├── backend service    (express-container/)
└── MongoDB plugin     (Railway built-in database)
```

### Steps

#### 1. Deploy Backend

1. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub
2. Select `fullstack-app-docker` repo
3. In service settings → **Root Directory** → set to `express-container`
4. Go to **Variables** tab → add:

```
MONGO_URI=mongodb://mongo:password@host:port/mydocker?authSource=admin
PORT=3000
```

#### 2. Deploy Frontend

1. In the same project → **Add Service** → same GitHub repo
2. In service settings → **Root Directory** → set to `react-container`
3. Go to **Variables** tab → add:

```
VITE_API_URL=https://your-backend.up.railway.app
```

> ⚠️ Vite bakes `VITE_API_URL` at **build time** — set this variable before deploying, and redeploy if you change it.

#### 3. Add MongoDB

1. In Railway project → **Add Service** → **Database** → **MongoDB**
2. Railway creates the database and provides connection variables automatically
3. Copy the connection string into your backend service Variables as `MONGO_URI`

> ⚠️ Railway MongoDB requires `?authSource=admin` at the end of your connection string:
> ```
> mongodb://mongo:password@host:port/mydocker?authSource=admin
> ```

#### 4. Configure CORS on Backend

Make sure your backend allows requests from your Railway frontend URL (no trailing slash):

```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.up.railway.app"  // no trailing slash
  ],
  credentials: true
}));
```

---

## Key Concepts Learned

### Environment Variables

| Context | Tool | Syntax |
|---|---|---|
| **Backend (Node/Bun)** | `dotenv` | `process.env.X` |
| **Frontend (Vite)** | Built into Vite | `import.meta.env.VITE_X` |

- Backend reads env vars at **runtime**
- Frontend (Vite) bakes env vars at **build time** — prefix must be `VITE_`
- Never use `dotenv` in frontend/browser code

### Docker Networking

- Containers on the same network communicate by **container name**
- `localhost` inside a container refers to that container only — not other containers
- Always use `mongodb://mongo:27017` not `mongodb://localhost:27017` when connecting from another container

### Local vs Production

| | Local | Railway Production |
|---|---|---|
| **MongoDB** | Docker container via Compose | Railway MongoDB plugin |
| **Env vars** | `.env` files | Railway Variables tab |
| **How services connect** | Docker network | Railway internal networking |
| **Frontend build** | Vite reads `.env` | Vite reads Railway Variables as build args |

---

## Dockerfile Notes

### Frontend Dockerfile — Build Args for Vite

Since Vite bakes environment variables at build time, the `VITE_API_URL` must be passed as a Docker build argument:

```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```

In `docker-compose.yml`, this is passed from your local `.env`:

```yaml
build:
  context: ./react-container
  args:
    - VITE_API_URL=${VITE_API_URL}
```

On Railway, the variable is automatically passed as a build arg from the Variables tab.

---

## License

MIT
