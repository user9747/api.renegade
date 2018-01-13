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

  return Comment_Like_Data;
}
