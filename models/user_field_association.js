"use strict";

module.exports = function(sequelize, DataTypes) {
    var User_Field_Association = sequelize.define("user_field_association", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: 'compositeIndex',
            allowNull: false
        },
        field_id: {
            type: DataTypes.INTEGER,
            unique: 'compositeIndex',
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

    return User_Field_Association;
}
