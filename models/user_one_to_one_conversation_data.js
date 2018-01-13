"use strict";

module.exports = function(sequelize, DataTypes) {
  var User_One_To_One_Conversation_Data = sequelize.define("user_one_to_one_conversation_data", {
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
    recipient_id: {
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

  return User_One_To_One_Conversation_Data;
}
