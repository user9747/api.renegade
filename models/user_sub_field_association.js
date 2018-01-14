"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_Sub_Field_Association = sequelize.define("user_sub_field_association", {
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
    sub_field_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false
    }
  });

  User_Sub_Field_Association.associate = function (models) {
    models.user_sub_field_association.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_id"
        // allowNull: false -- already defined
      }
    });

    models.user_sub_field_association.belongsTo(models.sub_fields, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "sub_field_id"
        // allowNull: false -- already defined
      }
    });
  };

  return User_Sub_Field_Association;
}
