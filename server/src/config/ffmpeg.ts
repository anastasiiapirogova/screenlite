import ffmpeg from 'fluent-ffmpeg'
import { path as ffmpegpath } from '@ffmpeg-installer/ffmpeg'
import { path as ffprobepath } from '@ffprobe-installer/ffprobe'

ffmpeg.setFfmpegPath(ffmpegpath)
ffmpeg.setFfprobePath(ffprobepath)

export { ffmpeg }