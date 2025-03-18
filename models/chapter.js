'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chapter.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' })
    }
  }
  Chapter.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chapter',
    tableName: 'Chapters'
  });
  return Chapter;
};