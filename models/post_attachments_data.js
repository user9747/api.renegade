"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post_Attachments_Data = sequelize.define("post_attachments_data", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
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

  Post_Attachments_Data.associate = function(models) {
    models.post_attachments_data.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Post_Attachments_Data;
}
