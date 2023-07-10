module.exports = (sequelize: any, DataTypes: any) => {
    const departments = sequelize.define(
        'Departments',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
                allowNull: false
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                field: 'is_deleted'
            }
        },
        {
            tableName: 'Departments',
            isDeleted: 'is-deleted',
            defaultScope: {
                where: {
                    is_deleted: 0
                }
            },
            associate(models: any) {
                departments.belongsTo(models.Departments, {
                    as: 'parentDepartment',
                    foreignKey: { field: 'parent_department_id' }
                });
                departments.hasMany(models.Departments, {
                    foreignKey: { field: 'parent_department_id' },
                    as: 'subDepartments'
                });
                departments.hasMany(models.Users, {
                    foreignKey: { name: 'departmentId', field: 'department_id' }
                });
            }
        }
    );

    return departments;
};
