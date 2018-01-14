"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post_Like_Data = sequelize.define("post_like_data", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
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

  Post_Like_Data.associate = function (models) {
    models.post_like_data.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });

    models.post_like_data.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Post_Like_Data;
}
