"use strict";

module.exports = function(sequelize, DataTypes) {
    var Fields = sequelize.define("fields", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        field_name: {
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

    return Fields;
}
