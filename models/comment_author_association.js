"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment_Author_Association = sequelize.define("comment_author_association", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  Comment_Author_Association.associate = function (models) {
    models.comment_author_association.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "author_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Comment_Author_Association;
}
