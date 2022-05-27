const { AppController } = require('../controllers/appController');
const { ClientController } = require('../controllers/clientController');
const { DataController } = require('../controllers/dataController')
exports.AppRouter = class AppRouter {
    constructor(agent) {
        this.agent = agent;
        this.appConnectionManager = this.agent.appConnectionManager;
        this.appController = new AppController(agent);
        this.RequestEmitter = agent.appConnectionManager.RequestEmitter
        this.dataController = new DataController(agent);
        this.clientController = new ClientController(agent);
    }

    createRouter() {
        this.agent.appConnectionManager.addRoute('increaseCountState', this.dataController.increaseCountState);
        this.agent.appConnectionManager.addRoute('playbackChange', this.clientController.emitPlaybackChange);
        console.log('⬜ App Router Is Ready!')
    }

}
