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
  }, {
    classMethods: {
      associate: function(models) {
        models.entities.hasMany(models.entityInformation);
        models.entities.hasMany(models.menuData, { foreignKey: {
          allowNull: false
        } });
      }
    }
  });

  return User_Post_Conversation_Data;
}
