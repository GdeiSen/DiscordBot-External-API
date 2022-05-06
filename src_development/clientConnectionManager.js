const config = require('../config.json');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');
const socketEmitter = new EventEmitter();
const  cors = require("cors");

class ClientConnectionManager extends EventEmitter {
    constructor() {
        super();
        this.socketEmitter = socketEmitter;
        this.socketStatus = { state: 'offline', info: 'not_connected' };
        this.httpStatus = { state: 'offline', info: 'not_connected' };
        this.app = express();
        this.app.use(cors())
        this.server = http.createServer(this.app);
    }

    async connect() {
        this.io = new Server(this.server, {cors: '*'});
        this.io.on("connection", (socket) => {
            this.socket = socket;
            this.socketStatus = { state: 'online', info: 'was_connected' };
            console.log(`⬜ Client Connection Is Enable. Port - [${config.EXT_CLIENT_PORT}] With Id -[${socket.id}]`)
            socket.on('message', (message) => {
                this.socketEmitter.emit('message', message);
            })
            socket.on('disconnect', () => {
                console.log('🟥 Server Socket Connection Error');
                this.socketStatus = { state: 'offline', info: 'was_disconnected' };
            })
        });
        this.server.listen(config.EXT_CLIENT_PORT);

        this.socketEmitter.on('message', (message) => { console.log(message) })
    }

}
exports.ClientConnectionManager = ClientConnectionManager;