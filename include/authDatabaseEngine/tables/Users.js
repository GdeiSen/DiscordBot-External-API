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
                type: DataTypes.CHAR,
                allowNull: false,
            },
            UserMail: {
                type: DataTypes.CHAR,
                allowNull: false,
            },
            UserPassword: {
                type: DataTypes.CHAR,
                allowNull: false,
            },
            UserRole: {
                type: DataTypes.CHAR,
                allowNull: false,
            },
            RegTime: {
                type: DataTypes.CHAR,
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

