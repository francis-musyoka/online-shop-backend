module.exports = (Sequelize, sequelize) => {
    const GuestCart = sequelize.define('GuestCart', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        guestId: {
            type: Sequelize.STRING,
            allowNull: false,
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
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0
        },
        expiresAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
    return GuestCart;
}