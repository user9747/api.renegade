"use strict";

module.exports = function(sequelize, DataTypes) {
  var Field_Sub_Field_Association = sequelize.define("field_sub_field_association", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    field_id: {
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

  Field_Sub_Field_Association.associate = function (models) {
    models.field_sub_field_association.belongsTo(models.fields, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "field_id"
        // allowNull: false -- already defined
      }
    });

    models.field_sub_field_association.belongsTo(models.sub_fields, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "sub_field_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Field_Sub_Field_Association;
}
