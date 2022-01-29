const EventEmitter = require('events');
const emitter = new EventEmitter;
const ws = require('ws');
const config = require('../../../config.json');

class ExternalClientManager extends EventEmitter {
    constructor(app) {
        super();
        this.wss;
        this.status = 'offline';
    }

    async createConnection() {
        try {
            this.wss = new ws.Server({
                port: config.EXT_CLIENT_PORT,
            }, () => { console.log(`⬜ External Client Connection Is Enable. Port - [${config.EXT_CLIENT_PORT}]`) })
            this.wss.on('connection', function connection(ws) {
                ws.on('message', async function (message) {
                    let parsedMessage = JSON.parse(message);
                    emitter.emit('message', parsedMessage);
                })
            })
            emitter.on('message', (message) => {
                this.status = 'online'
                this.emit('message', message);
            })
        } catch (error) { console.log('🟥 External Client Connection Error', error); this.status = 'offline'; this.emit('CHANGE') }
    }

    async sendData(message) {
        this.wss.clients.forEach(async client => {
            client.send(JSON.stringify(message));
        })
    }
}
exports.ExternalClientManager = ExternalClientManager;