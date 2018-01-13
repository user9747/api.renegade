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

  return Post_Like_Data;
}
