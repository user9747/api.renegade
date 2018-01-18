"use strict";

module.exports = function(sequelize, DataTypes) {
  var Sub_Fields = sequelize.define("sub_fields", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sub_field_name: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false
    },
    field_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  Sub_Fields.associate = function(models) {
    models.sub_fields.belongsTo(models.fields, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "field_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Sub_Fields;
}
