module.exports = function (sequelize, DataTypes) {
    const Series = sequelize.define('Series', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        seriesName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'None',
            validate: {
                len: [1],
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
        seriesSiteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
        seriesIdOnSite: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1],
            },

        },
        seriesImageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
        lastChecked: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            validate: {
                len: [1],
            },
        },
        lastChapterViewed: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0,
        },
    });

    Series.associate = function (models) {
        Series.belongsTo(models.SeriesSite, {
            foreignKey: 'seriesSiteId',
            targetKey: 'id',
        });
    };

    return Series;
};