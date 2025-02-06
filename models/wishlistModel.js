

module.exports = (Sequelize,sequelize)=>{
    const Wishlist = sequelize.define('WishList',{
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
        }
    });
    return Wishlist
};