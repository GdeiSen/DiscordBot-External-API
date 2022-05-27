const { AppRouter } = require('./routers/appRouter.js');
const { ClientConnectionManager } = require('./managers/clientConnectionManager');
const { ClientRouter } = require('./routers/clientRouter.js');
const { DatabaseRouter } = require('./routers/databaseRouter.js');
const { TokenRouter } = require('./routers/tokenRouter.js');
const { ConnectionManager } = require('../../RabbitMQConnectionUtil/index');
const config = require('../config.json')
exports.GatewayAgent = class GatewayAgent {
    constructor() {
        this.clientConnectionManager = new ClientConnectionManager();
        this.appConnectionManager = new ConnectionManager({
            dispatchTo: config.TO_APP_QUEUE,
            consumeOn: config.FROM_APP_QUEUE,
            durable: true,
            name: "APP"
        });
        this.databaseConnectionManager = new ConnectionManager({
            dispatchTo: config.TO_DATA_QUEUE,
            consumeOn: config.FROM_DATA_QUEUE,
            durable: true,
            name: "DATABASE"
        });
        this.tokenConnectionManager = new ConnectionManager({
            dispatchTo: config.TO_TOKEN_QUEUE,
            consumeOn: config.FROM_TOKEN_QUEUE,
            durable: true,
            name: "TOKENS"
        });
    }

    connect() {
        this.appConnectionManager.connect();
        this.clientConnectionManager.connect();
        this.databaseConnectionManager.connect();
        this.tokenConnectionManager.connect();
    }

    createRouters() {
        this.clientRouter = new ClientRouter(this);
        this.appRouter = new AppRouter(this);
        this.databaseRouter = new DatabaseRouter(this);
        this.tokenRouter = new TokenRouter(this);

        this.clientRouter.createExpressRouter();
        this.clientRouter.createSocketRouter();
        this.appRouter.createRouter();
        this.databaseRouter.createRouter();
        this.tokenRouter.createRouter();
    }
}

