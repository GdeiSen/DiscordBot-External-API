const { TokenController } = require("../controllers/tokenController");

exports.TokenRouter = class TokenRouter {
    constructor(agent) {
        this.agent = agent;
        this.tokenConnectionManager = agent.tokenConnectionManager;
        this.tokenController = new TokenController(agent);
    }

    createRouter() {
        this.tokenConnectionManager.addRoute('', (request, responce) => {  })
        console.log('⬜ Token Router Is Ready!')
    }
}
