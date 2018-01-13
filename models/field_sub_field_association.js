"use strict";

module.exports = function(sequelize, DataTypes) {
    var Field_Sub_Field_Association = sequelize.define("user_field_sub_field_association", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        field_id: {
            type: DataTypes.INTEGER,
            unique: 'compositeIndex',
            allowNull: false
        },
        sub_field_id: {
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

    return Field_Sub_Field_Association;
}
