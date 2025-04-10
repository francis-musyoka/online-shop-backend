// models/Order.js
module.exports = (Sequelize, sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        customerId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Customers',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        totalAmount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        orderNumber:{
            type: Sequelize.STRING,
            unique: true,
        },
        shippingAddress: {
            type: Sequelize.JSON, 
            allowNull: false,
          },
          billingAddress: {
            type: Sequelize.JSON,
            allowNull: true,
          },
        status: {
            type: Sequelize.ENUM("unpaid", "paid"),
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'unpaid'
        },
        paymentMethod: {
            type: Sequelize.STRING,
        },
    });

    return Order;
};
