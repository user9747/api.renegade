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
    date_of_birth: {
      type: DataTypes.DATEONLY,
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
    profile_picture: {
      type: DataTypes.STRING(255),
      unique: false,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false
    },
    occupation_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  Users.associate = function(models) {
    models.users.belongsTo(models.occupations, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "occupation_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Users;
}
