"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post_Data = sequelize.define("post_data", {
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
    author_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    post_content: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false
    },
    post_element_status: {
      type: DataTypes.CHAR(1),
      unique: false,
      allowNull: false
    },
    post_text: {
      type: DataTypes.TEXT('medium'),
      unique: false,
      allowNull: true
    },
    post_image: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true
    }
  });

  Post_Data.associate = function (models) {
    models.post_data.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });

    models.post_data.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "author_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Post_Data;
}
