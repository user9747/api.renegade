"use strict";

module.exports = function(sequelize, DataTypes) {
    var Post_Owner_Association = sequelize.define("post_owner_association", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        owner_id: {
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

    return Post_Owner_Association;
}
