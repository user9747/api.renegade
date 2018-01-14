"use strict";

module.exports = function(sequelize, DataTypes) {
  var Fields = sequelize.define("fields", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    field_name: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false
    }
  });

  return Fields;
}
