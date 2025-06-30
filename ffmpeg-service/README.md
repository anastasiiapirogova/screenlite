# FFmpeg Service

A sandboxed, secure FFmpeg service for video processing operations. This service is designed to isolate FFmpeg operations from the main application to prevent potential security vulnerabilities.

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Video Preview Generation
```
POST /preview
Content-Type: application/json

{
  "url": "https://example.com/video.mp4",
}
```
Generates a preview image from the first frame of a video.

### Video Metadata Extraction
```
POST /metadata
Content-Type: application/json

{
  "url": "https://example.com/video.mp4"
}
```
Extracts video metadata including dimensions, duration, codec, etc.

## Usage

## Environment Variables

- `PORT`: Service port (default: 3002)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `NODE_ENV`: Environment mode (production/development)

### Logs

```bash
# View service logs
docker logs screenlite-ffmpeg-service

# Follow logs in real-time
docker logs -f screenlite-ffmpeg-service
```

## Development

For development, you can run the service directly:

```bash
npm install
npm run dev
```

The service will be available at `http://localhost:3002`. 