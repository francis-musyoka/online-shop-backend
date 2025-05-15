module.exports = (Sequelize, sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        orderId: {
            type: Sequelize.STRING,
            references: {
                tableName: 'Orders',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        productId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        imagePath: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        productName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return OrderItem;
};