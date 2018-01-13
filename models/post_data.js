"use strict";

module.exports = function(sequelize, DataTypes) {
    var Post_Data = sequelize.define("post_data", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        post_unique_id: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        author_id: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        post_content: {
            type: DataTypes.STRING(255),
            unique: false,
            allowNull: false
        },
        post_category: {
            type: DataTypes.CHAR(1),
            unique: false,
            allowNull: false
        },
        post_text: {
              type: DataTypes.TEXT('medium'),
              unique: false,
              allowNull: true
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

    return Post_Data;
}
