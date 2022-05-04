const { AppConnectionManager } = require('./appConnectionManager.js');
const { ClientConnectionManager } = require('./clientConnectionManager')
let clientConnectionManager = new ClientConnectionManager();
let appConnectionManager = new AppConnectionManager('rpc_queue');
appConnectionManager.connect();
