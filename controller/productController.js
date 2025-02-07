const { json } = require("body-parser");
const db = require("../utils/database");
const ErrorResponse = require('../utils/error');
const { v4: uuidv4 } = require('uuid');
const { where } = require("sequelize");



const {Product, Category,Shop} = db;

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
            include: {
                model: Category,
                attributes: ['name']
            },
            attributes:['id','productName','quantity','image','price', 'status']
            // attributes:{exclude:['shopId','createdAt','updatedAt']}
        });
        res.status(200).json({
            success: true,
            shopProducts
        })
    } catch (error) {
        next(error)
    }
};


exports.editProduct = async(req,res,next)=>{
    const {id} = req.params;
    const {productName,description,category,price,quantity,sku,brand,
        condition,discount,status,dimensions,tags,keyFeatures} = req.body.formData;

    const shopId = req.shop.id; 
     
     
    try {
        const product = await Product.findOne({where:{id:id}});

        console.log('PRODUCT::=>',product);
        

        if(!product){
            return next(new ErrorResponse("No product found", 404))
        }


        if(shopId !== product.shopId){
            return next(new ErrorResponse("You are not allowed to edit this product", 401))
        }

        await product.update({
            productName:productName,
            description:description,
            categoryId:category,
            price:price,
            quantity:quantity,
            brand:brand,
            condition:condition,
            discount:discount,
            status:status,
            tags:tags,
            keyFeatures:keyFeatures,
            dimensions:dimensions,
        });

        res.status(200).json({
            success: true,
            msg:'Successfully updated'
        });
        
    } catch (error) {
        next(error)
    };
};

exports.getAllProducts = async(req,res,next)=>{
    try {
        const products = await Product.findAll({
            include:{
                model: Category,
                attributes:['name']
            },
            attributes:{exclude:['createdAt','updatedAt','shopId','categoryId']}
            // attributes:['id','productName','image','price']
        });
        
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        next(error)
    }
};

exports.getSingleProduct =async(req,res,next)=>{
        const {id} = req.params
        console.log('ID==>', id);
        
        try {
            const productDetail = await Product.findOne({
                where:{id:id},
                include:{
                    model: Category,
                    attributes:['name']
                },
                include:{
                    model: Shop,
                    attributes:['businessName']
                },
                attributes:{exclude:['createdAt','updatedAt','shopId','categoryId']}
            })

           
            res.status(200).json({
                success: true,
                productDetail
            })
        } catch (error) {
            next(error)
        }
};

exports.getCurrentProductOnEdit =async(req,res,next)=>{
        const {id} = req.params;
        const shopId = req.shop.id

        console.log('PRODUCT ID', id);
        console.log('SHOP ID', shopId);
        
        try {
            const product = await Product.findOne({
                where:{
                    id:id,
                    shopId:shopId
                },
                attributes:{exclude:['createdAt','updatedAt','shopId']}

            })
            if(!product){
                return next(new ErrorResponse('Product Not found', 404));
            }
            res.status(200).json({
                success: true,
                product
            })
        } catch (error) {
            next(error)
        }
};

exports.deleteProduct = async(req,res,next)=>{
    const {productId} = req.params;
    const shopId = req.shop.id;

    try {
        await Product.destroy({
            where:{
                id: productId,
                shopId: shopId
            }
        });

        res.status(204).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}