const EventEmitter = require('events');
const WebSocket = require('ws');
const emitter = new EventEmitter;
const ws = require('ws');
const config = require('../../../config.json');

class ExternalServerManager extends EventEmitter {
    constructor(client) {
        super();
        this.socket;
        this.status = 'offline';
    }

    async createConnection() {
        try {
            this.socket = new WebSocket('ws://localhost:5001')
            this.socket.onopen = (el) => {
                if (this.socket.readyState === 1) {
                    console.log(`⬜ External Server Connection Is Enable. Port - [${config.EXT_SERVER_PORT}]`);
                }
            }

            this.socket.onclose = () => {
                console.log('🟥 External Server Socket is closed!')
                this.emit('CLOSED');
            }

            this.socket.onerror = () => {
                console.log('🟥 External Server Socket connection error!');
                this.emit('ERROR');
            }

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data)
                this.emit('message', message);
            }
        } catch (error) { console.log('🟥 External Server Connection Error', error); this.status = 'offline'; this.emit('CHANGE') }
    }

    // async functionSelector(request, token, data) {
    //     switch (request) {
    //         case 'getAccount': this.broadcastDataFromDB(token, data); break;
    //         case 'createAccount': this.broadcastDataFromDB(token, data); break;
    //         case 'deleteAccount': this.broadcastDataFromDB(token, data); break;
    //         default: break;
    //     }
    // }
    async sendData(message) {
        this.socket.send(JSON.stringify(message));
    }
}
exports.ExternalServerManager = ExternalServerManager;