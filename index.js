const { GatewayAgent } = require('./src_development/agent.js');
const gatewayAgent = new GatewayAgent();
global.agent = gatewayAgent;
gatewayAgent.connect()
setTimeout(() => {
    gatewayAgent.createRouters()
}, 2000);


const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 5000 });
  console.log(tunnel.url);
})();