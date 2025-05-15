

// module.exports = (Sequelize, sequelize) => {
//     const Product = sequelize.define("Products", {
//         id: {
//             type: Sequelize.STRING,
//             unique: true,
//             primaryKey: true,
//         },
//         productName: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         description: {
//             type: Sequelize.JSON,
//             allowNull: false,
//         },
//         keyFeatures: {
//             type: Sequelize.JSON,
//             allowNull: false,
//         },
//         categoryId: {
//             type: Sequelize.STRING,
//             allowNull: false,
//             references: {
//                 model: 'Categories',
//                 key: 'id',
//                 onDelete: "CASCADE",
//             },
//         },
//         price: {
//             type: Sequelize.INTEGER,
//             allowNull: false,
//         },
//         quantity: {
//             type: Sequelize.INTEGER,
//             allowNull: false
//         },
//         brand: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         condition: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         discount: {
//             type: Sequelize.DECIMAL(10, 2),
//             defaultValue: 0

//         },
//         status: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         dimensions: {
//             type: Sequelize.TEXT
//         },
//         tags: {
//             type: Sequelize.TEXT,
//         },
//         image: {
//             type: Sequelize.JSON
//         },
//         shopId: {
//             type: Sequelize.STRING,
//             allowNull: false,
//             references: {
//                 model: 'Shops',
//                 key: 'id',
//                 onDelete: 'CASCADE',
//             }
//         }
//     });
//     return Product;
// };


module.exports = (Sequelize, sequelize) => {
    const Product = sequelize.define("Product", {
        id: {
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true,
        },
        productName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        keyFeatures: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        categoryId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                tableName: 'Categories',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        brand: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        condition: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        discount: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dimensions: {
            type: Sequelize.TEXT
        },
        tags: {
            type: Sequelize.TEXT,
        },
        image: {
            type: Sequelize.JSON
        },
        shopId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                tableName: 'Shops',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    });

    return Product;
};
