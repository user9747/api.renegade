"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post_Owner_Association = sequelize.define("post_owner_association", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  Post_Owner_Association.associate = function (models) {
    models.post_owner_association.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "owner_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Post_Owner_Association;
}
