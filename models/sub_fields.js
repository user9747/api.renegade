"use strict";

module.exports = function(sequelize, DataTypes) {
    var Sub_Fields = sequelize.define("sub_fields", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sub_field_name: {
            type: DataTypes.STRING(100),
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

    return Sub_Fields;
}
