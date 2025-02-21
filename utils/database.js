const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.DATABASE_local_HOST,
    dialect: process.env.DATABASE_DIALECT
  });

// const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
//   host: process.env.DATABASE_HOST,
//   dialect: process.env.DATABASE_DIALECT
// });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('../models/customerModel')(Sequelize,sequelize);
db.Shop = require('../models/shopModel')(Sequelize,sequelize);
db.Category = require('../models/categoryModel')(Sequelize,sequelize);
db.Product = require('../models/productModel')(Sequelize,sequelize);
db.Wishlist = require('../models/wishlistModel')(Sequelize,sequelize);
db.Cart = require('../models/cartModel')(Sequelize,sequelize);
db.GuestCart = require('../models/guestCartModel')(Sequelize,sequelize);

db.Category.hasMany(db.Product, { foreignKey: 'categoryId' ,onDelete: "CASCADE"});
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId' });

db.Shop.hasMany(db.Product, { foreignKey: 'shopId' ,onDelete: "CASCADE" });
db.Product.belongsTo(db.Shop, { foreignKey: 'shopId' });

db.Customer.hasMany(db.Wishlist,{ foreignKey: 'customerId' ,onDelete: "CASCADE"});
db.Wishlist.belongsTo(db.Customer,{foreignKey: 'customerId'});

db.Product.hasMany(db.Wishlist, { foreignKey: "productId" ,onDelete: "CASCADE"});
db.Wishlist.belongsTo(db.Product, { foreignKey: "productId" });

db.Customer.hasMany(db.Cart, { foreignKey: "customerId", onDelete: "CASCADE" });
db.Cart.belongsTo(db.Customer, { foreignKey: "customerId" });

db.Product.hasMany(db.Cart, { foreignKey: "productId", onDelete: "CASCADE" });
db.Cart.belongsTo(db.Product, { foreignKey: "productId" });

db.Product.hasMany(db.GuestCart, { foreignKey: "productId", onDelete: "CASCADE" });
db.GuestCart.belongsTo(db.Product, { foreignKey: "productId" });


module.exports = db;