module.exports = (Sequelize, sequelize) => {
    const MpesaTransaction = sequelize.define('MpesaTransaction', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        checkoutRequestId: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
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
        orderId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                tableName: 'Orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'

        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("pending", "completed", "failed"),
            defaultValue: "pending"
        },
        mpesaReceipt: {
            type: Sequelize.STRING,
            unique: true
        },
    });

    return MpesaTransaction;
};