"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment_Like_Data = sequelize.define("comment_like_data", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false
    }
  });

  Comment_Like_Data.associate = function (models) {
    models.comment_like_data.belongsTo(models.comment_author_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "comment_id"
        // allowNull: false -- already defined
      }
    });

    models.comment_like_data.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Comment_Like_Data;
}
