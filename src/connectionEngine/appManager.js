const EventEmitter = require('events');
const emitter = new EventEmitter;
const config = require('../../config.json');
const { io } = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios').default;

class ExternalServerManager extends EventEmitter {
    constructor(client) {
        super();
        this.socket;
        this.status = 'disconnected';
        this.waitingList = new Map();
        emitter.on('data', (data) => this.waitingListControl(data))
    }

    /**
    * Creates a connection to the application server based on the library socket.io
    */
    async createConnection() {
        let result = await axios.get('http://localhost:5001/test/11233');
        this.socket = io(`http://localhost:${config.EXT_SERVER_PORT}`, { reconnectionDelayMax: 10000 });
        this.socket.on('connect', () => {
            this.status = 'connected';
            this.emit('open', 'server');
            console.log(`⬜ External Server Connection Is Enable. Port - [${config.EXT_SERVER_PORT}] With Id - [${this.socket.id}]`);
        })
        this.socket.on('disconnect', () => {
            console.log('🟥 External Server Socket is closed!')
            this.status = 'disconnected';
            this.emit('closed', { type: 'error', data: 'Main Server Connection Lost' });
        })
        this.socket.on('data', (data) => {
            emitter.emit('data', data);
        })
        this.socket.on('respond', (data) => {
            emitter.emit('data', data);
        })
        this.socket.on('data', (data) => {
            emitter.emit('data', data);
        })
    }

    /**
     * Sends data to the server, and also automatically adds the body of the received information to be sent to the response waiting list. When the server responds with an identifier similar to the identifier stored in the waiting list, the object in the waiting list is deleted, and its body is transferred to the "bufferData" field of the response
     *
     * @param {object} data Data object with "dispatchData" field for sending
     */
    async sendData(message) {
        this.socket.emit('data', message);
    }

    async getData(message) {
        let dispatchId = uuidv4();
        message.dispatchId = dispatchId;
        this.waitingList.set(dispatchId, message);
        this.socket.emit('request', message);
    }

    waitingListControl(data) {
        if (data?.dispatchId && this.waitingList.has(data.dispatchId)) {
            data.bufferData = this.waitingList.get(data.dispatchId);
            this.waitingList.delete(data.dispatchId);
            this.emit('data', data);
        }
        else {
            console.log('Unidentified data received');
            this.emit('data', data);
        }
    }
}
exports.ExternalServerManager = ExternalServerManager;