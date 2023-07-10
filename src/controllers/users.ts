import { ResponseHandler } from '../middleware/response-handler';
import { ErrorFactory } from '../services/error-factory';
import { DepartmentRepo, UserRepo } from '../database/repository';

const log: any = require('../logger/winston').LOG;
const errorFactory = new ErrorFactory();
export class Users {
    private static responseHandler: ResponseHandler = new ResponseHandler();
    private static departmentRepo: DepartmentRepo = new DepartmentRepo();
    private static userRepo: UserRepo = new UserRepo();

    async addUser(req: any, res: any) {
        log.info('addAccountProvider', req.body);
        try {
            const { name, salary, currency, on_contract: onContract, department } = req.body;
            const dept: any = await Users.departmentRepo.get({ name: department });

            if (!dept) {
                return Users.responseHandler.sendError(req, res, errorFactory.notFoundData('DEPT_NOT_FORUND'));
            }

            await Users.userRepo.add({
                name: name,
                salary: salary,
                currency: currency,
                onContract: onContract,
                departmentId: dept.id
            });
            return Users.responseHandler.sendSuccess(req, res, null, 201);
        } catch (error) {
            console.log(error);
            Users.responseHandler.sendError(req, res, error);
        }
    }

    async deleteUser(req: any, res: any) {
        log.info('addAccountProvider', req.body);
        try {
            const { userId } = req.params;
            const user: any = await Users.userRepo.get({ id: userId });

            console.log(user);
            if (!user) {
                return Users.responseHandler.sendError(req, res, errorFactory.notFoundData('USER_NOT_FOUND'));
            }

            user.isDeleted = 1;
            await user.save();
            return Users.responseHandler.sendSuccess(req, res, null, 202);
        } catch (error) {
            console.log(error);
            Users.responseHandler.sendError(req, res, error);
        }
    }

    async getUsers(req: any, res: any) {
        log.info('addAccountProvider', req.body);
        try {
            const salaries = await Users.departmentRepo.getAllSalaries(req.query);

            console.log(salaries);
            return Users.responseHandler.sendSuccess(req, res, salaries);
        } catch (error) {
            console.log(error);
            Users.responseHandler.sendError(req, res, error);
        }
    }
}
