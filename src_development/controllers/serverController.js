let appManager
let dataManager
let tokenManager
exports.ServerController = class ServerController {
    constructor(agent) {
        appManager = agent.appConnectionManager
        dataManager = agent.databaseConnectionManager
        tokenManager = agent.tokenConnectionManager
    }
    async getStatus(req, res, next) {
        let appStatus = await appManager.get("status");
        let dataStatus = await dataManager.get("status");
        let tokenStatus = await tokenManager.get("status");
        try { res.send({appStatus, dataStatus, tokenStatus}) } catch (err) { console.log(err) }
    }
}
