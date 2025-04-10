
const { where } = require("sequelize");
const { createId, generateOrderNumber } = require("../../utils");
const db = require("../../utils/database");
const ErrorResponse = require('../../utils/error');

const {OrderItem,Order,MpesaTransaction,Customer} = db;


exports.createOrder = async (req, res,next) => {
    const { items, paymentMethod, shippingAddress} = req.body;
    const customerId = req.user.id;
    if (!items || items.length === 0) {
        return next(new ErrorResponse("No items in the order" , 400));
    }

    try {
        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const orderNumber = await generateOrderNumber();
        // Create new order
        const orderId = createId(); 

        console.log("Order Number created", orderId);
        
        await Order.create({
            id: orderId,
            customerId: customerId,
            orderNumber: orderNumber,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            shippingAddress: shippingAddress,
            status: "unpaid",
        });

        // Create all order items
        const orderItems = items.map(item => ({
            id: createId(),
            orderId: orderId,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            imagePath: item.image,
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

exports.fetchOrderSummary = async(req,res,next)=>{
    try {
        const {orderId} = req.params;

        if(!orderId){
            return next(new ErrorResponse('Order Number not provided', 400))
        };

        const orderDetails = await MpesaTransaction.findOne({
            where:{
                orderId: orderId
            },
            include: [
                {
                  model: Order,
                  attributes: ['totalAmount', 'orderNumber', 'status', 'paymentMethod', 'shippingAddress']
                },
                {
                  model: Customer,
                  attributes: ['firstName', 'lastName', 'email']
                }
              ],
              attributes:{
                exclude:['checkoutRequestId','customerId','orderId','mpesaReceipt','status','createdAt']
              }

        });

        if(!orderDetails){
            return next(new ErrorResponse("Order number not found", 4040))
        }

        const orderItems = await OrderItem.findAll({
            where:{
                orderId: orderId
            },
            attributes:{exclude:['createdAt', 'updatedAt','productId', 'orderId']}
        });

        if(!orderItems){
            return next(new ErrorResponse("Order items not found", 4040))
        }


        res.status(200).json({
            success: true,
            orderDetails,
            orderItems
        })
    } catch (error) {
        next(error)
    };
    
}