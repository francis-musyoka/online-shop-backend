

module.exports = (Sequelize, sequelize) => {
    const Wishlist = sequelize.define('WishList', {
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
                onDelete: 'CASCADE'
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
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'

        }
    });
    return Wishlist
};