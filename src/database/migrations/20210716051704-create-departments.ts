module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.createTable('Departments', {
            id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true
            },
            name: Sequelize.DataTypes.STRING,
            description: Sequelize.DataTypes.STRING,
            parent_department_id: {
                type: Sequelize.DataTypes.UUID,
                field: 'parent_department_id',
                references: { model: 'Departments', key: 'id' },
                default: null
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
                defaultValue: Sequelize.DataTypes.NOW
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
                defaultValue: Sequelize.DataTypes.NOW
            },
            isDeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
                field: 'is_deleted'
            }
        });
    },

    down: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.dropTable('Departments');
    }
};
