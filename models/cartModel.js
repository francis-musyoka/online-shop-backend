module.exports = (Sequelize, sequelize) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        customerId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                tableName: 'Customers',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        productId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                tableName: 'Products',
                key: 'id',
                onDelete: 'CASCADE'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0
        }
    });
    return Cart;
}