import { DatabaseInitializer } from '../database-initializer';
import { ErrorFactory } from '../../services/error-factory';

const errorFactory = new ErrorFactory();
const log = require('../../logger/winston').LOG;

export class DepartmentRepo {
    async add(data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                resolve(await dbInstance.Departments.create(data));
            } catch (error) {
                log.error('DepartmentRepo, add', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async get(query: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                resolve(await dbInstance.Departments.findOne({ where: query, logging: console.log }));
            } catch (error) {
                log.error('DepartmentRepo, get', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async getAll(query: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                resolve(await dbInstance.Departments.findAll({ where: query }));
            } catch (error) {
                log.error('DepartmentRepo, getAll', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async update(query: any, data: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbInstance = await DatabaseInitializer.getInstance();
                resolve(
                    await dbInstance.Departments.update(data, {
                        where: query
                    })
                );
            } catch (error) {
                log.error('DepartmentRepo, update', { message: error.message, stack: error.stack });
                return reject(errorFactory.databaseError(error));
            }
        });
    }

    async getAllSalaries(data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { Sequelize, Users, Departments } = await DatabaseInitializer.getInstance();
                const between = await DatabaseInitializer.getSequelizeOperator('between');

                const query = {
                    ...(data.year && {
                        created_at: {
                            [between]: [
                                new Date(data.year, 0, 1).toISOString(),
                                new Date(data.year, 11, 31).toISOString()
                            ]
                        }
                    }),
                    ...(data.on_contract && {
                        on_contract: data.on_contract
                    })
                };
                const result = await Departments.findAll({
                    raw: true,
                    nest: true,
                    attributes: [
                        ['id', 'department_id'],
                        ['name', 'department_name'],
                        [
                            Sequelize.fn(
                                'COALESCE',
                                Sequelize.fn(
                                    'LEAST',
                                    Sequelize.fn('MIN', Sequelize.col('Users.salary')),
                                    Sequelize.fn('MIN', Sequelize.col('subDepartments->Users.salary'))
                                ),
                                Sequelize.fn('MIN', Sequelize.col('Users.salary')),
                                Sequelize.fn('MIN', Sequelize.col('subDepartments->Users.salary'))
                            ),
                            'min_salary'
                        ],
                        [
                            Sequelize.fn(
                                'COALESCE',
                                Sequelize.fn(
                                    'GREATEST',
                                    Sequelize.fn('MAX', Sequelize.col('Users.salary')),
                                    Sequelize.fn('MAX', Sequelize.col('subDepartments->Users.salary'))
                                ),
                                Sequelize.fn('MAX', Sequelize.col('Users.salary')),
                                Sequelize.fn('MAX', Sequelize.col('subDepartments->Users.salary'))
                            ),
                            'max_salary'
                        ],
                        [
                            Sequelize.literal(
                                `COALESCE((AVG(\`Users\`.\`salary\`) + AVG(\`subDepartments->Users\`.\`salary\`)) / 2, AVG(\`Users\`.\`salary\`))`
                            ),
                            'mean_salary'
                        ]
                    ],
                    include: [
                        {
                            model: Departments,
                            as: 'subDepartments',
                            attributes: [
                                ['id', 'department_id'],
                                ['name', 'department_name'],
                                [Sequelize.fn('MIN', Sequelize.col('subDepartments->Users.salary')), 'min_salary'],
                                [Sequelize.fn('MAX', Sequelize.col('subDepartments->Users.salary')), 'max_salary'],
                                [Sequelize.fn('AVG', Sequelize.col('subDepartments->Users.salary')), 'mean_salary']
                            ],
                            include: [
                                {
                                    model: Users,
                                    where: query,
                                    attributes: []
                                }
                            ],
                            required: false
                        },
                        {
                            model: Users,
                            where: query,
                            attributes: []
                        }
                    ],
                    where: {
                        parent_department_id: null
                    },
                    group: ['Departments.id', 'Departments.name', 'subDepartments.id', 'subDepartments.name']
                });

                // Organize the result into nested structure
                const nestedResult = result.reduce((acc: any, department: any) => {
                    const { department_id, department_name, subDepartments, ...rest } = department;
                    if (!acc[department_id]) {
                        acc[department_id] = {
                            department_id,
                            department_name,
                            subDepartments: [],
                            ...rest
                        };
                    }

                    if (subDepartments && subDepartments.department_id) {
                        acc[department_id].min_salary =
                            (acc[department_id].min_salary > subDepartments.min_salary && subDepartments.min_salary) ||
                            acc[department_id].min_salary;
                        acc[department_id].max_salary =
                            (acc[department_id].max_salary < subDepartments.max_salary && subDepartments.max_salary) ||
                            acc[department_id].max_salary;
                        acc[department_id].mean_salary += subDepartments.mean_salary / 2;
                        acc[department_id].subDepartments.push(subDepartments);
                    }
                    return acc;
                }, {});

                const finalResult = Object.values(nestedResult);
                resolve(finalResult);
            } catch (error) {
                console.log(error);
                return reject(errorFactory.databaseError(error));
            }
        });
    }
}
