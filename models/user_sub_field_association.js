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
            unique: false,
            allowNull: false
        },
        sub_field_id: {
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

    return User_Sub_Field_Association;
}
