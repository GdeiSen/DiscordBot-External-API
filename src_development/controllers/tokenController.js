const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/apiError')
const config = require('../../config.json')
let tokenConnectionManager
exports.TokenController = class TokenController {
    constructor(agent) {
        tokenConnectionManager = agent.tokenConnectionManager
    }
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const { email, password } = req.body;
            let userData
            try {
                userData = await tokenConnectionManager.get({
                    name: 'registration',
                    email: email,
                    password: password,
                })
            } catch (error) { return next(ApiError.UnauthorizedError(error)) }
            if (!userData) return 0;
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await tokenConnectionManager.get({
                name: 'activate',
                activationLink: activationLink,
            })
            return res.redirect(`${config.CLIENT_URL}/home`);
        } catch (e) {
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            let userData;
            try {
                userData = await tokenConnectionManager.get({
                    name: 'login',
                    email: email,
                    password: password,
                })
            } catch (error) { return next(ApiError.UnauthorizedError(error)) }
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            let token
            try {
                token = await tokenConnectionManager.get({
                    name: 'logout',
                    refreshToken: refreshToken,
                })
            } catch (error) { return next(ApiError.UnauthorizedError(error)) }
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            let tokens
            try {
                tokens = await tokenConnectionManager.get({
                    name: 'refresh',
                    refreshToken: refreshToken,
                })
            } catch (error) { return next(ApiError.UnauthorizedError(error)) }
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(tokens);
        } catch (e) {
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
        }
    }
}
