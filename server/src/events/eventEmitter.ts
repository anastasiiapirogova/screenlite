import { EventEmitter } from 'events'

class AuthEventEmitter extends EventEmitter { }

export const authEventEmitter = new AuthEventEmitter()

class DeviceEventEmitter extends EventEmitter { }

export const deviceEventEmitter = new DeviceEventEmitter()

class PlaylistLayoutEventEmitter extends EventEmitter { }

export const playlistLayoutEventEmitter = new PlaylistLayoutEventEmitter()