"use strict";

module.exports = function(sequelize, DataTypes) {
    var Comment_Author_Association = sequelize.define("comment_author_association", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author_id: {
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

    return Comment_Author_Association;
}
