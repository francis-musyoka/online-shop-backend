
module.exports = (Sequelize, sequelize) => {
    const OrderCounter = sequelize.define('OrderCount', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            defaultValue: 1,
        },
        count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1000000, // Start from 1000000
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return OrderCounter;
}