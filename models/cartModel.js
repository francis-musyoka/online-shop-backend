module.exports = (Sequelize,sequelize)=>{
    const Cart = sequelize.define('Cart',{
        id:{
            type:Sequelize.STRING,
            primaryKey: true
        },
        customerId:{
            type:Sequelize.STRING,
            allowNull: false,
            references:{
                model: 'Customers',
                key: 'id'
            },
            onDelete:'CASCADE'
        },
        productId:{
            type:Sequelize.STRING,
            allowNull: false,
            references:{
                model: 'Products',
                key: 'id'
            },
            onDelete:'CASCADE'
        },
        quantity:{
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0
        }
    });
    return Cart;
}