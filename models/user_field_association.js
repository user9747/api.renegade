"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_Field_Association = sequelize.define("user_field_association", {
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
    field_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false
    }
  });

  User_Field_Association.associate = function (models) {
    models.user_field_association.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });

    models.user_field_association.belongsTo(models.fields, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "field_id"
        // allowNull: false -- already defined
      }
    });
  };

  return User_Field_Association;
}
