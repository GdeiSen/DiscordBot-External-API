const ApiError = require('../exceptions/apiError');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError('No Authorization Header!'));
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError('No Acces Token!'));
        }
        const userData = await global.agent.tokenConnectionManager.get({
            name: 'validateAccessToken',
            accessToken: accessToken,
        })
        if (!userData) {
            return next(ApiError.UnauthorizedError('User Not Logged In!'));
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};