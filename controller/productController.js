const { json } = require("body-parser");
const db = require("../utils/database");
const ErrorResponse = require('../utils/error');
const { v4: uuidv4 } = require('uuid');


const {Product, Category} = db;

exports.addProduct =async(req,res,next)=>{
   
    const files = req.files;
    const data = req.body;
    
    const {productName,description,category,price,quantity,sku,brand,
        condition,discount,status,dimensions,tags,rating,keyFeatures} = data;

    try {
        const imageUrl = files.map(path=>`/images/productImages/${path.filename}`)
        
        const id = uuidv4().replace(/-/g,"");
     
        const shop = req.shop;          
        
        await Product.create({
            id:id,
            productName:productName,
            description:description,
            categoryId:category,
            price:price,
            quantity:quantity,
            image:imageUrl,
            brand:brand,
            condition:condition,
            discount:discount,
            status:status,
            tags:tags,
            keyFeatures:keyFeatures,
            dimensions:dimensions,
            shopId:shop.id
       
        });

        res.status(201).json({
            success: true
        })

    } catch (error) {
        next(error)
    };
    
};

exports.getProductsForEachShop =async(req,res,next)=>{
    const shopId = req.shop.id; 
    
    try {
        const shopProducts = await Product.findAll({
            where:{shopId:shopId}, 
            include:{
                model:Category,
                attributes:['name'] 
            },
            attributes:['productName','quantity','image','price']
        });

        res.status(200).json({
            success: true,
            shopProducts
        })
    } catch (error) {
        next(error)
    }
}