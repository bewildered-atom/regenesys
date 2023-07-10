import { v4 as uuidv4 } from 'uuid';
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface: any, Sequelize: any) {
        const deptIds = [
            '0a8df9e4-e731-43d8-afda-b237e6d0cac9',
            'c6b06642-a753-4698-b395-6a4b6447e489',
            '0a8df9e4-e731-43d8-afda-12s7e6d0cac9'
        ];
        const depts = [
            {
                id: '0a8df9e4-e731-43d8-afda-b237e6d0cac9',
                name: 'Engineering',
                description: 'Engineering',
                parent_department_id: null,
                created_at: '2023-01-23 08:59:53',
                updated_at: '2023-01-23 08:59:53'
            },
            {
                id: 'c6b06642-a753-4698-b395-6a4b6447e489',
                name: 'DevOps',
                description: 'DevOps',
                parent_department_id: '0a8df9e4-e731-43d8-afda-b237e6d0cac9',
                created_at: '2023-01-23 08:59:53',
                updated_at: '2023-01-23 08:59:53'
            },
            {
                id: '0a8df9e4-e731-43d8-afda-12s7e6d0cac9',
                name: 'HR',
                description: 'Human Resource',
                parent_department_id: null,
                created_at: '2023-01-23 08:59:53',
                updated_at: '2023-01-23 08:59:53'
            }
        ];
        await queryInterface.bulkInsert('Departments', depts);
        const users = [];
        for (let i = 0; i < 20; i++) {
            users.push({
                id: uuidv4(),
                name: faker.person.fullName(),
                salary: faker.number.int({ min: 10000, max: 1000000 }),
                currency: 'USD',
                on_contract: faker.datatype.boolean(),
                department_id: deptIds[Math.floor(Math.random() * deptIds.length)],
                created_at: '2023-01-23 08:59:53',
                updated_at: '2023-01-23 08:59:53'
            });
        }

        return queryInterface.bulkInsert('Users', users);
    },

    async down(queryInterface: any, Sequelize: any) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
