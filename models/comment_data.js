"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment_Data = sequelize.define("comment_data", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    comment_text: {
      type: DataTypes.STRING('511'),
      unique: false,
      allowNull: false
    }
  });

  Comment_Data.associate = function (models) {
    models.comment_data.belongsTo(models.comment_author_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "comment_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Comment_Data;
}
