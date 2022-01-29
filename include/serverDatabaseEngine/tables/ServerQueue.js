const { DataTypes } = require('sequelize');
exports.createServerQueue = async function createModel(sequelize) {
    let ServerQueue = sequelize.define(
        'ServerQueue',
        {
            Id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            ServerId: {
                type: DataTypes.CHAR,
                allowNull: false,
            },
            SongName: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            SongUrl: {
                type: DataTypes.CHAR,
                allowNull: true,
            }
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        }
    )
    ServerQueue.rawAttributes
    return await ServerQueue;
}

