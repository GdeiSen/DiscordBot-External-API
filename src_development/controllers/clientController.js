let appManager
let dataManager
let tokenManager
let clientManager
exports.ClientController = class ClientController {
    constructor(agent) {
        appManager = agent.appConnectionManager
        dataManager = agent.databaseConnectionManager
        tokenManager = agent.tokenConnectionManager
        clientManager = agent.clientConnectionManager
    }
    async emitPlaybackChange(request, responce) {
        try {
            clientManager.emitSocket('playbackChange', request.serverId);
        } catch (error) { console.log(error) }
    }
}
