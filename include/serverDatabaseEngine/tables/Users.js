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
      UserName: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      UserServerId: {
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

