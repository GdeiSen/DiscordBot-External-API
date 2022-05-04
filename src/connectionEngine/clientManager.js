const EventEmitter = require('events');
const emitter = new EventEmitter;
const config = require('../../../config.json');
const { Server } = require('socket.io')
class ExternalClientManager extends EventEmitter {
    constructor(client) {
        super();
        this.status = 'disconnected';
    }

    /**
    * Creates a connection to the application client based on the library socket.io
    * 
    */
    async createConnection() {
        console.log(`⬜ External Client Connection Is Enable.`)
        this.io = new Server({ cors: { origin: "http://localhost:3000" } });
        this.io.on("connection", (socket) => {
            this.socket = socket;
            this.status = 'online';
            socket.on('request', (message) => {
                this.emit('request', message);
            })
            socket.on('data', (message) => {
                this.emit('request', message);
            })
        });
        this.io.listen(config.EXT_CLIENT_PORT);
    }

    /**
     * Sends data to the client
     *
     * @param {object} data Data object with "dispatchData" field for sending
     */
    async sendData(message) {
        if (!this.socket) return 0;
        this.socket.emit('data', message);
    }

}
exports.ExternalClientManager = ExternalClientManager;