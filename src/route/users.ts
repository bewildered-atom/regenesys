import { Users as UserController } from '../controllers/users';
import { ResponseHandler } from '../middleware/response-handler';
import { ErrorFactory } from '../services/error-factory';
const { body, param, query, validationResult } = require('express-validator');
const express = require('express');

const log: any = require('../logger/winston').LOG;
const router = express.Router();
const errorFactory = new ErrorFactory();

export class Users {
    private static userController: UserController = new UserController();
    private static responseHandler: ResponseHandler = new ResponseHandler();

    private static isNotAllowedKeySuperAdmin(value: any, isSuperAdmin: boolean | undefined) {
        if (isSuperAdmin && value?.toString()) {
            return Promise.reject('provided key is invalid');
        }
        return Promise.resolve();
    }

    static get manageUsers() {
        router.get(
            '',
            [query('year').optional().isLength({ min: 1 }), query('on_contract').optional().isLength({ min: 1 })],
            (req: any, res: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return Users.responseHandler.sendError(req, res, errorFactory.invalidParameter(errors.array()));
                }

                Users.userController.getUsers(req, res);
            }
        );
        router.post(
            '/',
            [
                body('name').exists().trim(),
                body('salary')
                    .exists()
                    .trim()
                    .isLength({ min: 1 })
                    .custom((value: any) => !Number.isNaN(Number(value)) && Number(value) > 0),
                body('currency').exists().trim(),
                body('on_contract').optional().isBoolean(),
                body('department').exists().trim()
            ],
            (req: any, res: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    log.info('accountProviderRoute, addaccountProvider', {
                        body: req.body,
                        params: req.params
                    });
                    return Users.responseHandler.sendError(req, res, errorFactory.invalidParameter(errors.array()));
                }

                Users.userController.addUser(req, res);
            }
        );
        router.delete('/:userId', [param('userId').exists().isLength({ min: 1 })], (req: any, res: any) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Users.responseHandler.sendError(req, res, errorFactory.invalidParameter(errors.array()));
            }

            Users.userController.deleteUser(req, res);
        });
        return router;
    }
}
