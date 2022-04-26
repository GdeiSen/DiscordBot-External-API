console.clear();
const { ServerAgent } = require("./src/serverAgent");
const serverAgent = new ServerAgent();
serverAgent.createWebSocketConnections();