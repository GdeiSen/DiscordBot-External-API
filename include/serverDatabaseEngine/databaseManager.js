const { Sequelize, DataTypes } = require('sequelize');
const EventEmitter = require('events');
const { createServerModel } = require('./tables/Servers');
const { createUserModel } = require('./tables/Users');
const { createCurrentPlayback } = require('./tables/CurrentPlayback')
const { createServerQueue } = require('./tables/ServerQueue')
const config = require('../../config.json')
class ServerDataBase extends EventEmitter {
  constructor() {
    super();
    this.serverDatabaseManager
  }

  async createConnection(option) {
    if (!config.USE_DATABASE_CONNECTION) return 0
    try {
      this.sequelize = new Sequelize(config.SQL_SERVER_SERVER_DB_NAME, config.SQL_SERVER_USER_NAME, config.SQL_SERVER_USER_PASSWORD, {
        dialect: config.SQL_SERVER_DIALECT,
        host: config.SQL_SERVER_HOST,
        logging: false,
      });
      await this.sequelize
        .authenticate()
        .then(() => { console.log('⬜ Server DataBase Connection Is Enable'); this.status = 'online'; })
        .catch(error => { console.error('🟥 Unable to connect to the database:', error); this.status = 'offline' })
      if (config.CREATE_SERVERLIST_TABLE) this.Server = await createServerModel(this.sequelize);
      if (config.CREATE_USERLIST_TABLE) this.User = await createUserModel(this.sequelize);
      if (config.CREATE_PLAYBACK_TABLE) this.CurrentPlayback = await createCurrentPlayback(this.sequelize);
      if (config.CREATE_QUEUE_TABLE) this.ServerQueue = await createServerQueue(this.sequelize);
    } catch (error) { console.log('🟥 Data Base Connection Error!'); this.status = 'offline'; this.emit('CHANGE') }
  }

  async pushData(model, data) {
    try {
      await this.sequelize.sync({ force: true });
      switch (model) {
        case 'currentPlayback': this.CurrentPlayback.bulkCreate(data); break;
        case 'serverQueue': this.ServerQueue.bulkCreate(data); break;
        case 'servers': this.Server.bulkCreate(data);break;
        case 'users': this.User.bulkCreate(data); break;
        default: break;
      }
    } catch (error) { console.log('🟥 Data Base Pushing Error!', error); this.status = 'offline', this.emit('CHANGE') }
  }

  async getData(request, data) {
    try {
      if (options && request == 'userList') {
        if (this.User) return (this.User.findAll({ where: { UserServerId: data.serverId } }));
      } else if (request == 'serverList') {
        if (this.Server) return (this.Server.findAll());
      } else if (options && request == 'currentPlayback') {
        if (this.CurrentPlayback) return (this.CurrentPlayback.findAll({ where: { ServerId: data.serverId } }));
      } else if (options && request == 'serverQueue') {
        if (this.ServerQueue) return (this.ServerQueue.findAll({ where: { ServerId: data.serverId } }));
      }
    } catch (error) { console.log('🟥 Data Base Selection Error!') }
  }

}
exports.ServerDataBase = ServerDataBase;