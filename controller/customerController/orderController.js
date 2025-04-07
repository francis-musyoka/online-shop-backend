
const { where } = require("sequelize");
const { createId } = require("../../utils");
const db = require("../../utils/database");
const ErrorResponse = require('../../utils/error');

const {OrderItem,Order} = db;


exports.createOrder = async (req, res) => {
    const { items, paymentMethod } = req.body;
    const customerId = req.user.id;
    if (!items || items.length === 0) {
        return next(new ErrorResponse("No items in the order" , 400));
    }

    try {
        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Create new order
        const orderId = createId(); 
        await Order.create({
            id: orderId,
            customerId: customerId,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            status: "unpaid"
        });

        // Create all order items
        const orderItems = items.map(item => ({
            id: createId(),
            orderId: orderId,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity
        }));

        await OrderItem.bulkCreate(orderItems);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            orderId: orderId
        });

    } catch (error) {
        console.error("Error creating order:", error);
        next(error)
    }
};

// Update Order if payment is completed
exports.updateOrder = async(req,res,next)=>{
    const {orderId} = req.params;
    const customerId = req.user.id;
    try {
        if(!orderId){
            return next(new ErrorResponse("No order number provided", 400));
        };

        const order = await Order.findOne({where:{id: orderId, customerId: customerId}});

        if(!order){
            return next(new ErrorResponse("Order number not found", 404));
        };

        order.status = "paid";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Status updated successfully"
        })
    } catch (error) {
        next(error)
    }
    
}