const { DataTypes } = require('sequelize');
exports.createUserModel = async function createModel(sequelize) {
    let User
    User = sequelize.define(
        'User',
        {
            Id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            UserLogin: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            UserMail: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            UserPassword: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            UserRole: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            RegTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,

        }
    )
    User.rawAttributes
    return await User;
}

