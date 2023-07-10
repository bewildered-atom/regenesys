module.exports = function (sequelize: any, dataTypes: any) {
    const users = sequelize.define(
        'Users',
        {
            id: {
                type: dataTypes.UUID,
                primaryKey: true,
                defaultValue: dataTypes.UUIDV4
            },
            name: {
                type: dataTypes.STRING
            },
            salary: {
                type: dataTypes.DECIMAL(13, 2),
                allowNull: false
            },
            currency: {
                type: dataTypes.STRING,
                allowNull: false
            },
            onContract: {
                type: dataTypes.BOOLEAN,
                field: 'on_contract',
                defaultValue: false
            },
            createdAt: {
                type: dataTypes.DATE,
                allowNull: false,
                field: 'created_at',
                defaultValue: dataTypes.NOW
            },
            isDeleted: {
                type: dataTypes.BOOLEAN,
                defaultValue: false,
                field: 'is_deleted'
            },
            updatedAt: {
                type: dataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
                defaultValue: dataTypes.NOW
            }
        },
        {
            tableName: 'Users',
            defaultScope: {
                where: {
                    is_deleted: 0
                }
            },
            associate(models: any) {
                users.belongsTo(models.Departments, { foreignKey: { name: 'departmentId', field: 'department_id' } });
            }
        }
    );

    return users;
};
