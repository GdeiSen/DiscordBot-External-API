const { DataController } = require('../controllers/dataController');

exports.DatabaseRouter = class DatabaseRouter {
    constructor(agent) {
        this.agent = agent;
        this.databaseConnectionManager = agent.databaseConnectionManager;
        this.dataController = new DataController(agent);
    }

    createRouter() {
        this.databaseConnectionManager.addRoute('',()=>{})
        console.log('⬜ Socket Router Is Ready!')
    }

}
