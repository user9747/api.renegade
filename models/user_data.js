"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_Data = sequelize.define("user_data", {
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
    key: {
      type: DataTypes.STRING(100),
      unique: 'compositeIndex',
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false
    }
  });

  User_Data.associate = function (models) {
    models.user_data.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });
  };

  return User_Data;
}
