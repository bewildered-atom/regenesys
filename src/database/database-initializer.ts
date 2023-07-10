import DatabaseService from './database-service';

export class DatabaseInitializer {
    public static async getInstance() {
        return DatabaseService.getDb();
    }

    public static async getSequelizeOperator(operator: any) {
        const { Sequelize } = await DatabaseService.getDb();
        const sequelizeOperator: any = {
            gt: Sequelize.Op.gt,
            lt: Sequelize.Op.lt,
            eq: Sequelize.Op.eq,
            between: Sequelize.Op.between
        };
        return sequelizeOperator[operator];
    }
}
