"use strict";

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING(32),
      unique: false,
      allowNull: false
    },
    second_name: {
      type: DataTypes.STRING(32),
      unique: false,
      allowNull: false
    },
    gender: {
      type: DataTypes.CHAR(1),
      unique: false,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false
    },
    occupation: {
      type: DataTypes.STRING(48),
      unique: false,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Users;
}
