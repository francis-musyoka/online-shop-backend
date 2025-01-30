module.exports = (Sequelize,sequelize)=>{
    const Category = sequelize.define("Categories",{
        id:{
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true,
        },
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        
    });
    return Category;
};