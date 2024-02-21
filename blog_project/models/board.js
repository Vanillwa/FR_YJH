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
      board.belongsTo(models.member, {foreignKey: 'id'})
    }
  }
  board.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    writer: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    readhit: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'board',
  });
  return board;
};