'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  board.init({
    writer: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    readhit: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'board',
  });

  board.associate = function(models){
    board.belongsTo(models.member, {
      foreignKey: 'writer'
    })
  }

  return board;
};