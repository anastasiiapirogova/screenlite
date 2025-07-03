# Screenlite Deployment Guide (Docker Compose)

Screenlite can be run locally using Docker Compose. This is the recommended way to get started for development and testing.

---

## Quick Start

1. **Clone the repository:**
	```sh
	git clone https://github.com/screenlite/screenlite.git
	cd screenlite
	```

2. **Start all services:**
	```sh
	docker compose up -d
	```

3. **Access the app:**
	- **Frontend:** [http://localhost:3001](http://localhost:3001)
	- **Backend API:** [http://localhost:3000](http://localhost:3000)
	- **MinIO Console:** [http://localhost:9001](http://localhost:9001) (user/pass: `screenlite`/`screenlite`)

---

## Services Overview

- **server**: Node.js backend (API, business logic)
- **client**: React frontend (web UI)
- **ffmpeg-service**: Sandboxed video processing
- **postgres**: PostgreSQL database
- **redis**: Redis cache/queue
- **minio**: S3-compatible object storage

---

## Ports

| Service         | Host Port | Container Port | Purpose                |
|-----------------|-----------|---------------|------------------------|
| Frontend (client) | 3001      | 3001          | Web UI                 |
| Backend (server) | 3000      | 3000          | API                    |
| Postgres        | 5432      | 5432          | Database               |
| Redis           | 6379      | 6379          | Cache/queue            |
| MinIO API       | 9000      | 9000          | S3 API                 |
| MinIO Console   | 9001      | 9001          | MinIO web console      |
| FFmpeg Service  | (internal)| 3002          | Video processing       |

---

## Persistent Volumes

Docker Compose creates named volumes for data persistence:
- `screenlite_storage`: App file storage
- `postgres_data`: Database data
- `redis_data`: Redis data
- `minio_data`: MinIO object storage
- `ffmpeg_logs`: FFmpeg logs

---

## Environment Variables

Most environment variables are set in `docker-compose.yml`. You can override them by editing the file or using Docker Compose overrides.

---

## Stopping, Resetting, and Rebuilding

- **Stop and remove all containers and volumes:**
	```sh
	docker compose down -v
	```
- **Restart everything:**
	```sh
	docker compose up -d
	```
- **Rebuild images (after code changes):**
	```sh
	docker compose up -d --build
	```

---

## Troubleshooting

- If a service fails to start, check logs:
	```sh
	docker compose logs <service>
	```
- Make sure ports 3000, 3001, 5432, 6379, 9000, and 9001 are free.
- For database or storage issues, try removing volumes (`down -v`) and restarting.
- Only development mode is supported. Production deployment is not yet available.

---

## Notes

- All data is stored in Docker volumes by default. Removing volumes will erase your data.
- The stack is for development/testing only. Do not use in production.
- For advanced configuration, edit `docker-compose.yml`.