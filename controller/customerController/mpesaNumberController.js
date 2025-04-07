
const db = require("../../utils/database");
const ErrorResponse = require('../../utils/error');
const { createId } = require('../../utils/index');

const {MpesaNumber} = db;

exports.saveMpesaNumber =async(req,res,next)=>{
    const {phoneNumber,countryCode} = req.body;
    const customerId = req.user.id

    

    console.log("customerId", customerId);
    

    try {
        
        const id = createId();  
        await MpesaNumber.destroy({where:{customerId:customerId}});

        const payment = await MpesaNumber.create({
                id:id,
                phoneNumber: phoneNumber,
                countryCode: countryCode,
                customerId: customerId,
            });

        res.status(201).json({
            success: true,
            payment
        })

    } catch (error) {
        next(error)
    };
    
};

exports.updateMpesaNumber = async(req,res,next)=>{
    const {id} = req.params;
    const {phoneNumber} = req.body;
    const customerId = req.user.id;

    try { 
        const number = await MpesaNumber.findOne({
            where:{id: id, customerId: customerId}
            }
        );
        
        number.phoneNumber = phoneNumber;
        await number.save();

        res.status(201).json({
            success: true,
            message: "Phone number updated successfully"
        })
    } catch (error) {
        next(error)
    };
};

exports.deleteMpesaNumber = async(req,res,next)=>{
    const {id} = req.params;
    const customerId = req.user.id;

    try {
        await MpesaNumber.destroy({
            where:{ 
                id:id,
                customerId:customerId
            }});

        res.status(200).json({
            success:true,
            message: "Payment successfully removed."
        });
    } catch (error) {
        next(error)
    }
};

exports.getMpesaNumber = async(req,res,next)=>{
    const customerId = req.user.id;

    try {
        const payment = await MpesaNumber.findOne({
            where:{ 
                customerId:customerId
            },
            attributes:{exclude:['createdAt','updatedAt']},
        });

        res.status(200).json({
            success:true,
            payment
        });
    } catch (error) {
        next(error)
    }
};

