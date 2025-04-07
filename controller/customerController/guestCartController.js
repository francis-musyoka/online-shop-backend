
const { createId } = require('../../utils/index');
const db = require('../../utils/database');

const {Product, GuestCart,Sequelize} = db;
const {Op} = Sequelize

exports.addProductToGuestCart = async(req,res,next)=>{

    try {
        const {productId, guestId} = req.body;
        const id = createId();
        
        await GuestCart.create({
            id: id,
            productId: productId,
            guestId: guestId,
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


exports.getGuestCart = async(req,res,next)=>{
    try {
        const {guestId} = req.params

        const cartItems = await GuestCart.findAll({
            where:{guestId: guestId},
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


exports.updateGuestCartQuantity = async(req,res,next)=>{
    const {productId} = req.params;
    const {newQuantity,guestId} = req.body;

    try {
        const isProductExist = await GuestCart.findOne({
            where:{
                productId: productId,
                guestId: guestId
            }
        });

        isProductExist.quantity = newQuantity 

        await isProductExist.save();

        res.status(200).json({
            success: true,
            message: 'Product quantity updated in the cart',
        });
       
        
    } catch (error) {
        next(error);
    }
};

exports.removeProductFromGuestCart = async(req,res,next)=>{
    const {productId} = req.params;
    const {guestId} = req.body

    try {
        await GuestCart.destroy({
            where:{
            guestId:guestId,
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

exports.clearExpiredGuestCarts = async () => {
    try {
        const currentTime = Date.now();

        await GuestCart.destroy({
            where: { expiresAt: { [Op.lt]: currentTime } }
        });

        console.log('Expired guest carts cleared successfully');
    } catch (error) {
        console.error('Error clearing expired guest carts:', error);
    }
};