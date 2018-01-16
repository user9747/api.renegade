"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment_Attachments_Data = sequelize.define("comment_attachments_data", {
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
    attachment: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false
    },
    attachment_status: {
      type: DataTypes.CHAR(1),
      unique: false,
      allowNull: false
    }
  });

  Comment_Attachments_Data.associate = function(models) {
    models.comment_attachments_data.belongsTo(models.comment_author_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "comment_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Comment_Attachments_Data;
}
