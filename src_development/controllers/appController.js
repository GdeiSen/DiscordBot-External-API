let appManager
exports.AppController = class AppController {
    constructor(agent) {
        appManager = agent.appConnectionManager
    }
    async getServers(req, res, next) {
        try { res.send(await appManager.get({ name: 'serverList' })) } catch (err) { console.log(err) }
    }

    async getServer(req, res, next) {
        try { res.send(await appManager.get({ name: 'server', serverId: req.params.serverId })) } catch (err) { console.log(err) }
    }

    async getPlayback(req, res, next) {
        try { res.send(await appManager.get({ name: 'currentPlayback', serverId: req.params.serverId })) } catch (err) { console.log(err) }
    }

    async getUsers(req, res, next) {
        try { res.send(await appManager.get({ name: 'userList', serverId: req.params.serverId })) } catch { }
    }

    async getQueue(req, res, next) {
        try { res.send(await appManager.get({ name: 'serverQueue', serverId: req.params.serverId })) } catch { }
    }

    async skipSongFunction(message) {
        try { appManager.post({ name: 'skipSongFunction', serverId: message.args.serverId }) } catch { }
    }

    async removeSongFunction(message) {
        try { appManager.post({ name: 'removeSongFunction', serverId: message.args.serverId, songIndex: message.args.songIndex }) } catch { }
    }

    async togglePauseSongFunction(message) {
        try { appManager.post({ name: 'togglePauseSongFunction', serverId: message.args.serverId }) } catch (err) { console.log(err) }
    }

    async disconnectFunction(message) {
        try { appManager.post({ name: 'disconnectFunction', serverId: message.args.serverId }) } catch { }
    }

    async test() {
        try { appManager.post({ name: 'testFunction' }) } catch { }
    }
}
