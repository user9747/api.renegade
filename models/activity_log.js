"use strict";

module.exports = function(sequelize, DataTypes) {
  var Activity_Log = sequelize.define("activity_log", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    activity_name: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false
    },
    activity_type: {
      type: DataTypes.STRING(32),
      unique: false,
      allowNull: false
    },
    activity_extra_info: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: true
    }
  });

  Activity_Log.associate = function (models) {
    models.activity_log.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Activity_Log;
}
