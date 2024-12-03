const { token } = require("morgan");


module.exports = (Sequelize,sequelize)=>{
    const Customer = sequelize.define('Customer',{
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false 
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
            notEmpty:{msg: 'Please add first name.'}
            },
          },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notEmpty: {msg: 'Please add last name.'}
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate:{
                isEmail:{msg: 'Please enter a valid email address.'},
                notEmpty: {msg: 'Email field cannot be empty.'},
            },
        },
        password: {
            type: Sequelize.STRING(1234),
            allowNull: false,
        },
        token:{
            type: Sequelize.STRING(1234),
        }
    });

    return Customer;
}