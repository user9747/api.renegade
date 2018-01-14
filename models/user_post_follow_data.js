"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_Post_Follow_Data = sequelize.define("user_post_follow_data", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false
    }
  });

  User_Post_Follow_Data.associate = function (models) {
    models.user_post_follow_data.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });

    models.user_post_follow_data.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });
  };

  return User_Post_Follow_Data;
}
