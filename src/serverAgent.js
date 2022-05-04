const { ExternalClientManager } = require("./connectionEngine/client/clientManager");
const { ExternalServerManager } = require("./connectionEngine/server");
const { AuthDataBase } = require("./databaseEngine/databaseManager");
const EventEmitter = require('events');
const messageEmitter = new EventEmitter;
const config = require('../config.json')
exports.ServerAgent = class ServerRouter extends EventEmitter {

    constructor() {
        super();
        this.clientWebsocketManager = new ExternalClientManager();
        this.serverWebsocketManager = new ExternalServerManager();
        this.authDatabaseManager = new AuthDataBase();
    }

    createWebSocketConnections() {
        this.clientWebsocketManager.createConnection();
        this.serverWebsocketManager.createConnection();

        this.clientWebsocketManager.on('data', (message) => { this.#redirector(message, 'data') });
        this.clientWebsocketManager.on('request', (message) => { this.#redirector(message, 'request') });
        this.serverWebsocketManager.on('data', (message) => { this.#redirector(message, 'data')});
        this.serverWebsocketManager.on('closed', (errorData) => { this.clientWebsocketManager.sendData(errorData); });
        this.serverWebsocketManager.on('open', (openData) => { this.clientWebsocketManager.sendData(openData) });
    }

    createDatabaseConnections() {
        authDatabaseManager.createConnection();
    }

    #redirector(message, type) {
        let recipient = message.recipient? message.recipient : message.bufferData.recipient;
        if (type == "request" && message.destination == "app_server") this.serverWebsocketManager.getData(message)
        if (type == "data" && recipient == "app_server") this.serverWebsocketManager.sendData(message)
        if (type == "data" && recipient == "client_server") this.clientWebsocketManager.sendData(message)
    }
}
// switch (request.name) {
            //     case 'getServerUsers':
            //         if (request.src === 'database') { this.clientWebsocketManager.sendData(await this.serverDatabaseManager.getData('users', data)); }
            //         else this.clientWebsocketManager.sendData(await this.serverWebsocketManager.getData(message));
            //         break;
            //     case 'getServers':
            //         if (request.src === 'database') { this.clientWebsocketManager.sendData(await this.serverDatabaseManager.getData('servers', data)) }
            //         else { this.clientWebsocketManager.sendData(await this.serverWebsocketManager.getData(message)); }
            //         break;
            //     case 'getCurrentPlayback':
            //         if (request.src === 'database') this.clientWebsocketManager.sendData(await this.serverDatabaseManager.getData('currentPlayback', data));
            //         else { this.clientWebsocketManager.sendData(await this.serverWebsocketManager.getData(message)); }
            //         break;
            //     case 'getServerQueue':
            //         if (request.src === 'database') this.clientWebsocketManager.sendData(await this.serverDatabaseManager.getData('serverQueue', data));
            //         else { this.clientWebsocketManager.sendData(await this.serverWebsocketManager.getData(message)); }
            //         break;
            //     case 'togglePauseSongFunction':
            //         this.serverWebsocketManager.sendData(message);
            //         break;
            //     case 'skipSongFunction':
            //         this.serverWebsocketManager.sendData(message);
            //         break;
            //     case 'removeSongFunction':
            //         this.serverWebsocketManager.sendData(message);
            //         break;
            //     case 'test':
            //         if (this.serverWebsocketManager.status !== "connected") this.clientWebsocketManager.sendData({ type: 'error', data: 'Main Server Connection Error!' });
            //         else this.clientWebsocketManager.sendData({ type: 'test', data: 'Test Completed' });
            //         break;
            //     default: break;
            // }