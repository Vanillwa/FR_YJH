'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  member.init({
    email: DataTypes.STRING,
    pwd: DataTypes.STRING,
    nickname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'member',
  });

  member.associate = function(models){
    member.hasMany(models.board, {foreignKey : 'writer'})
  }

  return member;
};