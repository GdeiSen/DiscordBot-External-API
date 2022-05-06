console.clear();
// const { ServerAgent } = require("./src/serverAgent");
// const serverAgent = new ServerAgent();
// serverAgent.createWebSocketConnections();
const { GatewayAgent } = require('./src_development/agent.js');
const gatewayAgent = new GatewayAgent();
gatewayAgent.connect();
setTimeout(() => {
    gatewayAgent.bindAllConnections({retry: true});
}, 1000);
