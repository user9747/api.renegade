"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_Post_Conversation_Data = sequelize.define("user_post_conversation_data", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    conversation_text: {
      type: DataTypes.STRING(511),
      unique: false,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    }
  });

  User_Post_Conversation_Data.associate = function (models) {
    models.user_post_conversation_data.belongsTo(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "sender_id"
        // allowNull: false -- already defined
      }
    });

    models.user_post_conversation_data.belongsTo(models.post_owner_association, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "post_id"
        // allowNull: false -- already defined
      }
    });
  };

  return User_Post_Conversation_Data;
}
