"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post_Collaborator_Association = sequelize.define("post_collaborator_association", {
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
    collaborator_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  Post_Collaborator_Association.associate = function (models) {
    models.post_collaborator_association.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });

    models.post_collaborator_association.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "collaborator_id"
        // allowNull: false -- already defined
      }
    });
  };

  return Post_Collaborator_Association;
}
