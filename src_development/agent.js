const { response } = require('express');
const { request } = require('http');
const { AppConnectionManager } = require('./appConnectionManager.js');
const { ClientConnectionManager } = require('./clientConnectionManager')

exports.GatewayAgent = class GatewayAgent {
    constructor() {
        this.clientConnectionManager = new ClientConnectionManager();
        this.appConnectionManager = new AppConnectionManager();
        this.clientAttemptTimer;
    }

    connect() {
        this.appConnectionManager.connect('rpc_queue');
        this.clientConnectionManager.connect();
    }

    bindAllConnections(options) {
        const self = this
        this.bindHTTPClientConnection();
        bindSockets();
        function bindSockets() {
            if (self.bindSocketClientConnection() == false && options.retry == true) {
                setTimeout(() => {bindSockets()}, 8000);
            }
        }
    }

    bindHTTPClientConnection() {
        let clientApp = this.clientConnectionManager.app;
        let ServiceApp = this.appConnectionManager;
        clientApp.get('/servers', async (request, response) => {
            response.send(await ServiceApp.get({ request: 'servers' }))
        })
        clientApp.get('/serverUsers/:serverId', async (request, response) => {
            response.send(await ServiceApp.get({ request: 'serverUsers', serverId: request.params.serverId }) )
        })
        clientApp.get('/currentPlayback/:serverId', async (request, response) => {
            response.send(await ServiceApp.get({ request: 'currentPlayback', serverId: request.params.serverId }))
        })
        clientApp.get('/serverQueue/:serverId', async (request, response) => {
            response.send(await ServiceApp.get({ request: 'serverQueue', serverId: request.params.serverId }))
        })
        return true;
    }

    bindSocketClientConnection() {
        if (!this.clientConnectionManager.socket) { console.log('🟥 Socket Bind Error, Socket Is Not Connected! Attempt To Reconnect In 8 Sec'); return false }
        this.clientConnectionManager.socket.on('request', (message) => {
            switch (message.path) {
                case 'skipSongFunction': { this.appConnectionManager.send({ request: 'skipSongFunction', serverId: message.args.serverId }); break }
                case 'removeSongFunction': { this.appConnectionManager.send({ request: 'removeSongFunction', serverId: message.args.serverId }); break }
                case 'togglePauseSongFunction': { this.appConnectionManager.send({ request: 'togglePauseSongFunction', serverId: message.args.serverId }); break }
                case 'disconnectFunction': { this.appConnectionManager.send({ request: 'disconnectFunction', serverId: message.args.serverId }); break }
                default: break;
            }
        })
        return true;
    }
}
