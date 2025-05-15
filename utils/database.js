const { Sequelize } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');

// const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_ROOT_PASSWORD, {
//     host: process.env.DATABASE_local_HOST,
//     dialect: process.env.DATABASE_DIALECT
//   }); 



// const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
//   host: process.env.DATABASE_HOST,
//   dialect: process.env.DATABASE_DIALECT
// });



const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  ssl: false,
  clientMinMessages: 'notice',
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('../models/customerModel')(Sequelize, sequelize);
db.Shop = require('../models/shopModel')(Sequelize, sequelize);
db.Category = require('../models/categoryModel')(Sequelize, sequelize);
db.Product = require('../models/productModel')(Sequelize, sequelize);
db.Wishlist = require('../models/wishlistModel')(Sequelize, sequelize);
db.Cart = require('../models/cartModel')(Sequelize, sequelize);
db.GuestCart = require('../models/guestCartModel')(Sequelize, sequelize);
db.ShippingAddress = require('../models/shippingAddressesModel')(Sequelize, sequelize);
db.MpesaNumber = require('../models/mpesaNumberModel')(Sequelize, sequelize);
db.MpesaTransaction = require('../models/mpesaTranscationModel')(Sequelize, sequelize);
db.Order = require('../models/customerModels/orderModel')(Sequelize, sequelize);
db.OrderItem = require('../models/customerModels/orderItemModel')(Sequelize, sequelize);
db.OrderCounter = require('../models/customerModels/orderCounterModel')(Sequelize, sequelize);


//Relationships

db.Category.hasMany(db.Product, { foreignKey: { name: 'categoryId', onDelete: 'CASCADE', onUpdate: 'CASCADE', } });

db.Product.belongsTo(db.Category, { foreignKey: { name: 'categoryId', onDelete: 'CASCADE', onUpdate: 'CASCADE', } });


db.Shop.hasMany(db.Product, { foreignKey: { name: 'shopId', onDelete: 'CASCADE', onUpdate: 'CASCADE' }, });
db.Product.belongsTo(db.Shop, { foreignKey: { name: 'shopId', onDelete: 'CASCADE', onUpdate: 'CASCADE' }, });

db.Customer.hasMany(db.Wishlist, { foreignKey: { name: 'customerId', onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.Wishlist.belongsTo(db.Customer, { foreignKey: { name: 'customerId', onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Product.hasMany(db.Wishlist, { foreignKey: { name: "productId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.Wishlist.belongsTo(db.Product, { foreignKey: { name: "productId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Customer.hasMany(db.Cart, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.Cart.belongsTo(db.Customer, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Product.hasMany(db.Cart, { foreignKey: { name: "productId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.Cart.belongsTo(db.Product, { foreignKey: { name: "productId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Product.hasMany(db.GuestCart, { foreignKey: { name: "productId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.GuestCart.belongsTo(db.Product, { foreignKey: { name: "productId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Customer.hasMany(db.ShippingAddress, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.ShippingAddress.belongsTo(db.Customer, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Customer.hasMany(db.MpesaNumber, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.MpesaNumber.belongsTo(db.Customer, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Customer.hasMany(db.MpesaTransaction, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.MpesaTransaction.belongsTo(db.Customer, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Order.hasMany(db.MpesaTransaction, { foreignKey: { name: "orderId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.MpesaTransaction.belongsTo(db.Order, { foreignKey: { name: "orderId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });


db.Order.hasMany(db.OrderItem, { foreignKey: { name: "orderId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.OrderItem.belongsTo(db.Order, { foreignKey: { name: "orderId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });

db.Customer.hasMany(db.Order, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });
db.Order.belongsTo(db.Customer, { foreignKey: { name: "customerId", onDelete: "CASCADE", onUpdate: 'CASCADE' } });


module.exports = db;