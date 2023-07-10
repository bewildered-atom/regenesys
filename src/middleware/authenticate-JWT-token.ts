import { ResponseHandler } from './response-handler';
import { ErrorFactory } from '../services/error-factory';

const config: any = require('../../config');
const errorFactory = new ErrorFactory();
export class AuthenticateJWTToken {
    private static responseHandler: ResponseHandler = new ResponseHandler();

    static async authenticateAccount(req: any, res: any, next: any): Promise<any> {
        const { authorization, ...restHeaders } = req.headers;
        let authType = '';
        let authToken = '';
        if (authorization && authorization.length) {
            [authType, authToken] = authorization.split(' ');
        }

        if (!authToken || authToken !== Buffer.from(`${config.auth.password}:${config.auth.password}`).toString('base64')){
            AuthenticateJWTToken.responseHandler.sendError(req, res, errorFactory.unauthorizedRequest());
            return;
        }

        next();
    }
}
