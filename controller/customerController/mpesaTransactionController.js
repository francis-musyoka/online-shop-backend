
const db = require("../../utils/database");
const ErrorResponse = require('../../utils/error');
const { createId, generateStkPushPassword, getStkPushAccessToken } = require('../../utils');
const { default: axios } = require("axios");

const {MpesaTransaction} = db;


exports.stkPush = async(req,res,next)=>{
    const {total,phoneNumber,orderNumber} = req.body;
    const id = createId();

    console.log("Order Number=>",orderNumber);
    
    const customerId = req.user.id

    //Password => A base64 encoded string. (The base64 string is a combination of Shortcode+Passkey+Timestamp)
    try {
        
        const [password,timeStamp] = generateStkPushPassword();
        const access_token = await getStkPushAccessToken();

        console.log("PHONE NUMBER::+>", phoneNumber);
        console.log("TOTAL AMOUNT::+>", total);
        const payLoad = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timeStamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: total,
            PartyA: phoneNumber,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: 'https://d6f2-41-209-3-194.ngrok-free.app/mpesa/callback', // This is a placeholder
            AccountReference: 'CompanyXLTD',
            TransactionDesc: 'Payment for goods',
        };

        const {data} = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            payLoad,
            {headers:{
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }},
        );

        await MpesaTransaction.create({
            id:id,
            orderId: orderNumber,
            checkoutRequestId:data.CheckoutRequestID,
            customerId: customerId,
            amount: total,
            phoneNumber: phoneNumber
        });
     
        res.status(200).json({
            success: true,
            message: "STK Push sent",
            data
        }
        )
        
    } catch (error) {
        next(error)
    }
   
}

exports.mpesaCallBack = async(req,res,next)=>{
   const stkCallback = req.body?.Body?.stkCallback;
    console.log("Body:", req.body);

    try {
            // Check if stkCallback exists
        if (!stkCallback) {
            console.log("stkCallback is missing in the request body");
            return next(new ErrorResponse("Invalid callback data", 400));
        }
            // Extract data from stkcallback
        const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

            // Find the corresponding payment using CheckoutRequestID
        const payment = await MpesaTransaction.findOne({ where: { checkoutRequestId: CheckoutRequestID } });
    
        if (!payment) {
            return next(new ErrorResponse("Payment record not found", 404));
        };
    
        if(ResultCode === 0) {
            // Successful payment
            
            const mpesaReceipt = CallbackMetadata?.Item?.find(item => item.Name === "MpesaReceiptNumber")?.Value;
            console.log("mpesaReceipt==> ", mpesaReceipt);
            
            // Update payment status
            payment.status ='completed',
            payment.mpesaReceipt = mpesaReceipt

            await payment.save();

            console.log("Payment completed");
    
        }else{
            // Payment failed or cancelled
            payment.status = "failed";
            await payment.save();

            console.log('Payment Cancelled');
        }
       
        res.status(200).json({
            success: true, 
            message: "Callback processed successfully" 
        })

    } catch (error) {
        next(error)
    }
    
   
}

exports.getMpesaTransactionStatus = async(req,res,next)=>{
    const {transactionId} = req.params
    console.log("Transaction Id::=>", transactionId);
    
    try {
    if(!transactionId){
        console.log("NO ID +++==>>");
        return next(new ErrorResponse( "No Transaction id ", 400))
    };

    const transactionDetails = await MpesaTransaction.findOne({
        where:{checkoutRequestId: transactionId},
        attributes:{exclude:['createdAt']}
    })

    console.log("Transaction Detailes==> ", );
    
    if(!transactionDetails){
        console.log("NO DETAILS +++==>>");
        
        return next (new ErrorResponse("No record found", 404))
    };

    res.status(200).json({
        success: true,
        transactionDetails
    })

    } catch (error) {
    next(error)
    }
}

