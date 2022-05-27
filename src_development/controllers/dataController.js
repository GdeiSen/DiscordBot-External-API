exports.DataController = class DataController {
    constructor(agent) {
        this.databaseConnectionManager = agent.databaseConnectionManager
    }
    async increaseCountState(request, responce) {
        try {
            this.databaseConnectionManager.post(
                {
                    name: "increaseCountState",
                    serverId: serverId,
                    state: state,
                }
            )
        } catch {

        }
    }

}
