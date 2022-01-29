const { ExternalClientManager } = require("./client/websocketManager");
const { ExternalServerManager } = require("./server/websocketManager");
const EventEmitter = require('events');
const messageEmitter = new EventEmitter;
const clientWebsocketManager = new ExternalClientManager();
const serverWebsocketManager = new ExternalServerManager();
exports.ServerRouter = class ServerRouter extends EventEmitter {

    constructor(authDatabaseManager, serverDatabaseManager) {
        super();
        this.authDatabaseManager = authDatabaseManager;
        this.serverDatabaseManager = serverDatabaseManager;
        this.clientWebsocketManager = clientWebsocketManager;
        this.serverWebsocketManager = serverWebsocketManager;
    }

    createConnections() {
        clientWebsocketManager.createConnection();
        serverWebsocketManager.createConnection();

        clientWebsocketManager.on('message', (message) => {
            messageEmitter.emit('clientMessage', this.#clientRequestSelector(message))
        })
        serverWebsocketManager.on('message', (message) => {
            messageEmitter.emit('serverMessage', this.#serverRespondSelector(message))
        })
    }

    #clientRequestSelector(message) {
        let request = message.request;
        let data = message.data;
        if(request.src === 'database') return 0; //BLOCKER
        switch (request.name) {
            case 'getServerUsers':
                if (request.src === 'database') this.serverDatabaseManager.getData('userList', data);
                else serverWebsocketManager.sendData(message);
                break;
            case 'getServers':
                if (request.src === 'database') this.serverDatabaseManager.getData('serverList', data);
                else {serverWebsocketManager.sendData(message);}
                break;
            case 'getCurrentPlayback':
                if (request.src === 'database') this.serverDatabaseManager.getData('currentPlayback', data);
                else serverWebsocketManager.sendData(message);
                break;
            case 'getServerQueue':
                if (request.src === 'database') this.serverDatabaseManager.getData('serverQueue', data);
                else serverWebsocketManager.sendData(message);
                break;
            case 'togglePauseSongFunction':
                serverWebsocketManager.sendData(message);
                break;
            case 'skipSongFunction':
                serverWebsocketManager.sendData(message);
                break;
            case 'removeSongFunction':
                serverWebsocketManager.sendData(message);
                break;
            default: break;
        }

    }

    #serverRespondSelector(message) {
        if(message?.requestMessage?.recipient == "server"){
            this.serverDatabaseManager.pushData(message.type, message.data);
        }
        else if(message?.requestMessage?.recipient == "client"){
            this.clientWebsocketManager.sendData(message)
        }
    }
}