"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post_Sub_Field_Association = sequelize.define("post_sub_field_association", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    sub_field_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    association_status: {
      type: DataTypes.CHAR(1),
      unique: false,
      allowNull: false
    }
  });

  Post_Sub_Field_Association.associate = function (models) {
    models.post_sub_field_association.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });

    models.post_sub_field_association.belongsTo(models.sub_fields, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "sub_field_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Post_Sub_Field_Association;
}
