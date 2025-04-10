

module.exports = (Sequelize,sequelize)=>{
    const Shop = sequelize.define('Shop',
        {
            id:{
                type: Sequelize.STRING,
                unique: true,
                primaryKey: true,
            },
            businessName:{
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate:{
                    notEmpty: {msg: 'Please add business name.'}
                }
            },
            businessNumber: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate:{
                    notEmpty: {msg: 'Please add business number.'}
                }
            },
            email:{
                type: Sequelize.STRING,
                unique: true,
                validate:{
                    isEmail:{msg: 'Please enter a valid email address'},
                    notEmpty: {msg: 'Please add Email.'}
                }
            },
            password:{
                type: Sequelize.STRING(1234),
                allowNull: false,
            },
            addressLine1:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            addressLine2:{
                type: Sequelize.STRING(1234)
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
            accessToken:{
                type: Sequelize.STRING, 
                defaultValue: null
            },
            forgotPasswordLink:{
                type: Sequelize.STRING(1234),
            },
            linkExpiresIn:{
                type: Sequelize.DATE
            }
        }
    )

    return Shop;
};