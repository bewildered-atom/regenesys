module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.DataTypes.UUIDV4
            },
            name: {
                type: Sequelize.DataTypes.STRING
            },
            salary: {
                type: Sequelize.DataTypes.DECIMAL(13, 2),
                allowNull: false
            },
            currency: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            onContract: {
                type: Sequelize.DataTypes.BOOLEAN,
                field: 'on_contract',
                default: false
            },
            departmentId: {
                type: Sequelize.DataTypes.UUID,
                references: { model: 'Departments', key: 'id' },
                field: 'department_id',
                onDelete: 'CASCADE',
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
                defaultValue: Sequelize.DataTypes.NOW
            },
            isDeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: 0,
                field: 'is_deleted'
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
                defaultValue: Sequelize.DataTypes.NOW
            }
        });
    },

    down: async (queryInterface: any, Sequelize: any) => {
        queryInterface.dropTable('Users');
    }
};
