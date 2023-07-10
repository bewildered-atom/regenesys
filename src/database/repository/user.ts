import { DatabaseInitializer } from '../database-initializer';
import { ErrorFactory } from '../../services/error-factory';

const errorFactory = new ErrorFactory();
const log = require('../../logger/winston').LOG;

export class UserRepo {
    async add(data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                resolve(await dbInstance.Users.create(data));
            } catch (error) {
                log.error('UserRepo, add', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async get(query: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                resolve(await dbInstance.Users.findOne({ where: query }));
            } catch (error) {
                log.error('UserRepo, get', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async getAll(data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                const between = await DatabaseInitializer.getSequelizeOperator('between');

                const query = {
                    ...(data.year && {
                        created_at: {
                            [between]: [
                                new Date(data.year, 0, 1).toISOString(),
                                new Date(data.year, 11, 31).toISOString()
                            ]
                        }
                    })
                };
                resolve(
                    await dbInstance.Users.findAndCountAll({
                        where: query,
                        raw: true,
                        nest: true,
                        include: {
                            model: dbInstance.Departments,
                            include: { model: dbInstance.Departments, required: false }
                        },
                        logging: console.log
                    })
                );
            } catch (error) {
                log.error('UserRepo, getAll', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async update(query: any, data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                const updates = await dbInstance.Users.update(data, {
                    where: query,
                    logging: console.log
                });
                resolve(updates);
            } catch (error) {
                log.error('UserRepo, update', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }
}
