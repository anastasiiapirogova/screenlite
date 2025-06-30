import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { spawn } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: false,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'ffmpeg-service' });
});

app.post('/preview', async (req, res) => {
    try {
        const { url, outputFormat = 'png' } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            new URL(url);
        } catch {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const args = [
            '-i', url,
            '-frames:v', '1',
            '-f', outputFormat,
            '-vcodec', outputFormat === 'png' ? 'png' : 'jpeg',
            '-y',
            'pipe:1'
        ];

        const ffmpeg = spawn('ffmpeg', args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, PATH: '/usr/bin:/bin' }
        });

        let stderr = '';
        ffmpeg.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        res.setHeader('Content-Type', `image/${outputFormat}`);

        ffmpeg.stdout.pipe(res);

        ffmpeg.on('close', (code) => {
            if (code !== 0) {
                console.error('FFmpeg failed:', stderr);
                if (!res.headersSent) {
                    res.status(500).json({ error: `FFmpeg failed with code ${code}: ${stderr}` });
                }
            }
        });

        ffmpeg.on('error', (error) => {
            console.error('FFmpeg process error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to generate preview' });
            }
        });

    } catch (error) {
        console.error('Preview generation error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate preview' });
        }
    }
});

app.post('/metadata', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            new URL(url);
        } catch {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const args = [
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height,codec_name,codec_type,bit_rate,r_frame_rate',
            '-show_entries', 'format=duration,format_name',
            '-of', 'json',
            url
        ];

        const ffprobe = spawn('ffprobe', args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, PATH: '/usr/bin:/bin' }
        });

        let output = '';
        let stderr = '';

        ffprobe.stdout.on('data', (data) => {
            output += data.toString();
        });

        ffprobe.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        await new Promise((resolve, reject) => {
            ffprobe.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`FFprobe failed with code ${code}: ${stderr}`));
                }
            });
        });

        const metadata = JSON.parse(output);
        const stream = metadata.streams?.[0];
        const format = metadata.format;

        if (!stream || !format) {
            return res.status(400).json({ error: 'No video stream found' });
        }

        const result = {
            width: stream.width || 0,
            height: stream.height || 0,
            duration: format.duration ? Math.round(parseFloat(format.duration) * 1000) : 0,
            codec: stream.codec_name,
            videoBitrate: stream.bit_rate ? parseInt(stream.bit_rate) : 0,
            videoFrameRate: stream.r_frame_rate ? parseFloat(stream.r_frame_rate) : 0
        };

        res.json(result);

    } catch (error) {
        console.error('Metadata extraction error:', error);
        res.status(500).json({ error: 'Failed to extract metadata' });
    }
});

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`FFmpeg service running on port ${PORT}`);
}); 