const { DataTypes } = require('sequelize');
exports.createCurrentPlayback = async function createModel(sequelize) {
    let CurrentPlayback = sequelize.define(
        'CurrentPlayback',
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
            Song: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            QueueLoop: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            SongLoop: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            Volume: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            Thumbnail: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        }
    )
    CurrentPlayback.rawAttributes
    return await CurrentPlayback;
}

