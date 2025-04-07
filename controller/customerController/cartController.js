const { where } = require('sequelize');
const { createId } = require('../../utils/index');
const db = require('../../utils/database');
const ErrorResponse = require('../../utils/error');

const {Customer,Product, Cart,GuestCart} = db;

exports.addProductToCart = async(req,res,next)=>{

    try {
        const {productId} = req.params;
        // const {quantity} = req.body
        const id = createId();
        const customerId = req.user.id;
        
        // Check if product is in the cart
        const isProductExist = await Cart.findOne({
            where:{
                productId: productId,
                customerId: customerId
            }
        });

        await Cart.create({
            id: id,
            productId: productId,
            customerId: customerId,
            quantity: 1
        });

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
        })
        
    } catch (error) {
        next(error)
    };
};


exports.getCustomerCart = async(req,res,next)=>{
    try {
        const customerId = req.user.id;

        const cartItems = await Cart.findAll({
            where:{customerId: customerId},
            include:{
                model: Product,
                attributes:['productName','price','discount','image','status','quantity']
            },
            attributes:{exclude:['createdAt','updatedAt']}
        });

        res.status(200).json({
            success:true,
            cartItems
        });
        
    } catch (error) {
        next(error);
    };
    
};


exports.updateCartQuantity = async(req,res,next)=>{
    const {productId} = req.params;
    const {newQuantity} = req.body;
    const customerId = req.user.id;

    try {
        const isProductExist = await Cart.findOne({
            where:{
                productId: productId,
                customerId: customerId
            }
        });

        isProductExist.quantity = newQuantity 

        await isProductExist.save();

        res.status(200).json({
            success: true,
            message: 'Product quantity updated in the cart',
            isProductExist
        });
       
        
    } catch (error) {
        next(error);
    };
};

exports.removeProductFromCart = async(req,res,next)=>{
    const {productId} = req.params;
    const customerId = req.user.id;

    try {
        await Cart.destroy({
            where:{
            customerId:customerId,
            productId: productId
            }
        });

        res.status(200).json({
            success:true,
            message: "Item successfully removed."
        });

    } catch (error) {
        next(error)
    }
};

exports.clearCart = async(req,res,next)=>{
    const customerId = req.user.id;
    try {
        await Cart.destroy({
            where:{
            customerId:customerId,
            },
        });
        res.status(200).json({
            success:true,
            message: "Cart was cleared successfully"
        });

    } catch (error) {
        next(error)
    };
}
