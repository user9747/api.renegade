"use strict";

module.exports = function(sequelize, DataTypes) {
    var Comment_Data = sequelize.define("comment_data", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comment_unique_id: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        comment_text: {
              type: DataTypes.STRING('511'),
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

    return Comment_Data;
}
