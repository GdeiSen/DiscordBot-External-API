 const { Sequelize, DataTypes } = require('sequelize');
const EventEmitter = require('events');
const config = require('../../config.json')
const { createUserModel } = require("./tables/Users");
class AuthDataBase extends EventEmitter {
    constructor(client) {
        super();
    }

    async createConnection() {
        try {
            this.sequelize = new Sequelize(config.SQL_SERVER_AUTH_DB_NAME, config.SQL_SERVER_USER_NAME, config.SQL_SERVER_USER_PASSWORD, {
                dialect: config.SQL_SERVER_DIALECT,
                host: config.SQL_SERVER_HOST,
                logging: false,
            });
            await this.sequelize
                .authenticate()
                .then(() => { console.log('⬜ Auth DataBase Connection Is Enable'); this.status = 'online'; })
                .catch(error => { console.error('🟥 Unable to connect to the database:', error); this.status = 'offline' })
            if (config.CREATE_USER_TABLE) this.#createUserModel();
        } catch (error) { console.log('🟥 Data Base Connection Error!'); this.status = 'offline'; this.emit('CHANGE') }
    }

    async #createUserModel() {
        return this.usersModel = await createUserModel(this.sequelize);
    }

    getUsers(request, options) {
        if (!this.usersModel) return 0;
        try {
            if (options && request == 'userById') {
                return (this.usersModel.findAll({ where: { UserId: options } }));
            } else if (options && request == 'userByLogin') {
                return (this.usersModel.findAll({ where: { UserLogin: options } }));
            } else if (options && mrequestode == 'users') {
                return (this.usersModel.findAll());
            }
        } catch (error) { console.log('🟥 Data Base getData Error!'); return 0 }
    }

    updateUsers(type, data) {
        if (!this.usersModel) return 0;
        try {
            if (data && type == 'add') {
                if (!data.user) return 0;
                this.#addUser(data.user);
            }
            else if (data && type == 'delete') {
                if (!data.user.id) return 0;
                this.#deleteUser(data.user.id);
            }
            else if (data && type == 'edit') {
                if (!data.user.id || !data.editData) return 0;
                this.#updateUser(data.user.id, data.editData);
            }
        } catch (error) { console.log('🟥 Data Base pushData Error!'); return 0 }
    }

    #addUser(user) {
        this.usersModel.create({
            UserLogin: user?.login,
            UserMail: user?.mail,
            UserPassword: user?.password,
            UserRole: user?.role,
            RegTime: new Date()
        });
    }

    #deleteUser(userId) {
        this.usersModel.destroy({
            where: {
                Id: userId
            }
        });
    }

    #updateUser(userId, editData) {
        this.usersModel.update({
            UserLogin: editData?.login,
            UserMail: editData?.mail,
            UserPassword: editData?.password,
            UserRole: editData?.role
        }, {
            where: { Id: userId }
        })
    }
}
exports.AuthDataBase = AuthDataBase;