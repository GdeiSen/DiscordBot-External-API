const { ServerRouter } = require("./include/websocketEngine/serverRouter");
const { AuthDataBase } = require("./include/authDatabaseEngine/databaseManager");
const { ServerDataBase } = require("./include/serverDatabaseEngine/databaseManager");
console.clear();
const serverDatabaseManager = new ServerDataBase();
const authDatabaseManager = new AuthDataBase();

authDatabaseManager.createConnection();
serverDatabaseManager.createConnection();
const serverRouter = new ServerRouter(authDatabaseManager, serverDatabaseManager);
serverRouter.createConnections();