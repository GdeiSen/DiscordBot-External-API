const { DataTypes } = require('sequelize');
const EventEmitter = require('events')
let emitter = new EventEmitter();
exports.createServerModel = async function createModel(sequelize) {
  let Server
  Server = sequelize.define(
    'Server',
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ServerName: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      ServerId: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      MemberCount: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      // YouTubePlaybacksCount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // YouTubeSongPlaybacksCount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // YouTubePlayListPlaybacksCount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // SpotifySongPlaybacksCount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // SpotifyAlbumPlaybacksCount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,

    }
  )
  Server.rawAttributes
  return await Server;
}

