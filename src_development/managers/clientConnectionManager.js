const config = require('../../config.json');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const EventEmitter = require('events');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const errorMiddleware = require('../middlewares/errorMiddleware');

exports.ClientConnectionManager = class ClientConnectionManager {
    constructor() {
        this.MessageEmitter = new EventEmitter();;
        this.app = express();
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(errorMiddleware);
        this.app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true,
            optionSuccessStatus: 200
        }));
        this.server = http.createServer(this.app);
    }

    async connect() {
        this.io = new Server(this.server, { cors: '*' });
        this.io.on("connection", (socket) => {
            this.socket = socket;
            socket.on('message', (message) => {
                this.MessageEmitter.emit('message', message, socket);
            })
            socket.on('disconnect', () => {
                console.log('🟥 Server Socket Connection Error');
            })
        });
        this.server.listen(config.EXT_CLIENT_PORT);
        this.MessageEmitter.on('message', (message) => { console.log(message) })
        console.log(`⬜ Ready To Consume Messages From The Client On Port [${config.EXT_CLIENT_PORT}]`)
    }

    emitSocket(name, args) {
        if(!this.io) return 0;
        this.io.emit(name, args);
    }


}
