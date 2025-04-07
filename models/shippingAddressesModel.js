module.exports = (Sequelize,sequelize)=>{
    const ShippingAddress = sequelize.define('ShippingAddress',
        {
            id:{
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true,
            },
            customerId:{
                type: Sequelize.STRING,
                reference:{
                    model: 'Customers',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            firstName:{
                type: Sequelize.STRING,
                allowNull: false,
                validate:{
                    notEmpty: {msg: 'Please add business name.'}
                }
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
                validate:{
                    notEmpty: {msg: 'Please add business number.'}
                }
            },
            address:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            apartment:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            city:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            state:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            zipCode:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            country:{
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Kenya"
            },
            phoneNumber:{
                type:Sequelize.STRING,
                allowNull: false,
            },
            isDefault:{
                type:Sequelize.BOOLEAN,
                defaultValue: false
            }
        }
    )

    return ShippingAddress;
};