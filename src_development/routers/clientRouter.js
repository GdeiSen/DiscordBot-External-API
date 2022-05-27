const { AppController } = require('../controllers/appController');
const { TokenController } = require('../controllers/tokenController');
const { body } = require('express-validator');
const Router = require('express').Router;
const router = new Router();
const errorMiddleware = require('../middlewares/errorMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { ServerController } = require('../controllers/serverController');
exports.ClientRouter = class ClientRouter {
    constructor(agent) {
        this.agent = agent;
        this.clientConnectionManager = agent.clientConnectionManager;
        this.tokenController = new TokenController(this.agent);
        this.appController = new AppController(this.agent);
        this.serverController = new ServerController(this.agent)
    }

    createExpressRouter() {
        router.get('/serverList', authMiddleware, this.appController.getServers);
        router.get('/server/:serverId', authMiddleware, this.appController.getServer);
        router.get('/userList/:serverId', authMiddleware, this.appController.getUsers);
        router.get('/currentPlayback/:serverId', authMiddleware, this.appController.getPlayback);
        router.get('/serverQueue/:serverId', authMiddleware, this.appController.getQueue);
        router.get('/status', this.serverController.getStatus);
        router.post('/registration', body('email').isEmail(), body('password').isLength({ min: 3, max: 32 }), this.tokenController.registration);
        router.post('/login', this.tokenController.login);
        router.post('/logout', this.tokenController.logout);
        router.get('/activate/:link', this.tokenController.activate);
        router.get('/refresh', this.tokenController.refresh);
        router.post('/users', this.tokenController.getUsers);

        this.clientConnectionManager.app.use(router);
        this.clientConnectionManager.app.use(errorMiddleware);
        console.log('⬜ Express Router Is Ready!')
    }

    createSocketRouter() {
        this.clientConnectionManager.MessageEmitter.on('message', (message) => {
            console.log(message.path)
            switch (message.path) {
                case 'skipSongFunction': this.appController.skipSongFunction(message); break
                case 'removeSongFunction': this.appController.removeSongFunction(message); break
                case 'togglePauseSongFunction': this.appController.togglePauseSongFunction(message); break
                case 'disconnectFunction': this.appController.disconnectFunction(message); break
                case 'test': this.appController.test; break
                default: break;
            }
        })
        console.log('⬜ Socket Router Is Ready!')
    }

}
