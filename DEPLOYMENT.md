## Running with Docker (Development Only)

You can run Screenlite in a development environment using Docker. This is the recommended way to get started quickly for testing and development purposes.

1. **Clone the repository:**
	```sh
	git clone https://github.com/screenlite/screenlite.git
	cd screenlite
	```

2. **Start the app using Docker Compose:**
	```sh
	docker compose up -d
	```

3. **Access Screenlite:**
	Open your browser and go to [http://localhost:3001](http://localhost:3001) (or the port you configured).

> **Note:** Only development mode is currently supported. Production-ready Docker deployment will be available in a future release.

## Stopping and Resetting Docker Containers

To stop all Docker containers, remove all volumes, and start fresh:

```sh
docker compose down -v
docker compose up -d
```