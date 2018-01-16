"use strict";

module.exports = function(sequelize, DataTypes) {
  var Occupations = sequelize.define("occupations", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    occupation: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    channel: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  return Occupations;
}
