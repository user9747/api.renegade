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
  }, {
    classMethods: {
      associate: function(models) {
        models.entities.hasMany(models.entityInformation);
        models.entities.hasMany(models.menuData, { foreignKey: {
          allowNull: false
        } });
      }
    }
  });

  return User_Post_Follow_Data;
}
