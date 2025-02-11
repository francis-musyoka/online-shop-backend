
const { where } = require('sequelize');
const db = require('../utils/database');
const{removeWishList,addWishlist} = require('../utils/index')

const{Wishlist,Product} = db;


exports.addAndRemoveFromWishlist = async(req,res,next)=>{
    const {productId} = req.params;
    const customerId = req.user.id;

    try {
        const isItemExist = await Wishlist.findOne({where:{
            customerId:customerId,
            productId: productId
        }})

        if(isItemExist){
            await removeWishList(productId,customerId);

            res.status(200).json({
                success:true,
                message: "Item successfully removed."
            });

        }else{

            await addWishlist(productId, customerId);

            res.status(201).json({
                success: true,
                message: "Product successfully added to your wishlist"
                });
        };

    } catch (error) {
        next(error)
    }
    

};

exports.checkIfProductIsInWishlist = async(req,res,next)=>{
    const {productId} = req.params;
    const customerId = req.user.id;
    
    try {
        let isInWishlist;

        const product = await Wishlist.findOne({where:{
            customerId:customerId,
            productId: productId
        }})

        if(product){
            isInWishlist = true
        }else{
            isInWishlist = false
        };

        res.status(200).json({
            success: true,
            isInWishlist
        });

    } catch (error) {
        next(error)
    }
};


exports.getWishlist = async(req,res,next)=>{
    const customerId  = req.user.id;

    console.log('CUSTOMER ID', customerId);
    

    try {
        const myWishlist = await Wishlist.findAll({
            where:{
                customerId: customerId
            },
            include:{
                model: Product,
                attributes:['productName','price','discount','image']
            },
            attributes:{exclude:['createdAt','updatedAt']}
        });
        
        res.status(200).json({
            success:true,
            myWishlist
        })
    } catch (error) {
        next(error)
    }
    
};

exports.getLimittedWishlist = async(req,res,next)=>{
    const customerId  = req.user.id;
    
    try {
        const myWishlist = await Wishlist.findAll({
            where:{
                customerId: customerId
            },
            include:{
                model: Product,
                attributes:['productName','price','discount','image']
            },
            attributes:{exclude:['createdAt','updatedAt']},
            limit: 4
        });
        
        res.status(200).json({
            success:true,
            myWishlist
        })
    } catch (error) {
        next(error)
    }
    
}
