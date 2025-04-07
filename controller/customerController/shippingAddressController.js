
const { where } = require('sequelize');
const { createId } = require('../../utils');
const db = require('../../utils/database');
const ErrorResponse = require('../../utils/error');

const {ShippingAddress} = db;

exports.addNewAddress = async(req,res,next)=>{

    try {
        const formData = req.body.formData;
        const { firstName,lastName, address,city,state,zipCode, country,apartment, phoneNumber} = formData;
        const id = createId();
        const customerId = req.user.id;
        
        await ShippingAddress.create({
            id: id,
            customerId: customerId,
            firstName: firstName,
            lastName: lastName,
            address: address,
            apartment: apartment,
            city: city,
            state: state,
            zipCode: zipCode,
            country: country,
            phoneNumber: phoneNumber,
        });

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
        })
        
    } catch (error) {
        next(error)
    };
};


exports.getAddresses = async(req,res,next)=>{
    try {
        const customerId = req.user.id;

        const addresses = await ShippingAddress.findAll({
            where:{customerId: customerId},
            attributes:{exclude:['createdAt','updatedAt', 'customerId']}
        });

        res.status(200).json({
            success:true,
            addresses
        });
        
    } catch (error) {
        next(error);
    };
    
};


exports.updateAddress = async(req,res,next)=>{
    const {addressId} = req.params;
    const formData = req.body.formData;
    
    const { firstName,lastName, address,apartment,city,state,zipCode, country, phoneNumber} = formData;

    const customerId = req.user.id;

    try {
        const isAddress = await ShippingAddress.findOne({
            where:{
                id: addressId,
                customerId: customerId
            }
        });

        if(!isAddress){
            return next(new ErrorResponse('Address not found', 404))
        }

        isAddress.firstName = firstName,
        isAddress.lastName =  lastName,
        isAddress.address= address,
        isAddress.apartment= apartment,
        isAddress.city= city,
        isAddress.state= state,
        isAddress.zipCode= zipCode,
        isAddress.country = country,
        isAddress.phoneNumber = phoneNumber

        await isAddress.save();

        res.status(200).json({
            success: true,
            message: 'Address updated succefully',
        });
       
        
    } catch (error) {
        next(error);
    }
};

exports.removeAddress = async(req,res,next)=>{
    const {addressId} = req.params;
    const customerId = req.user.id;

    try {
        await ShippingAddress.destroy({
            where:{
                id:addressId,
                customerId: customerId
            }
        });

        res.status(200).json({
            success:true,
            message: "Address successfully removed."
        });

    } catch (error) {
        next(error)
    }
};

exports.setAddressAsDefault = async(req,res,next)=>{
    const {addressId} = req.params;
    const customerId = req.user.id;

    try {
        const address = await ShippingAddress.findOne({ where: { id: addressId, customerId:customerId } });

        if (!address) {
          return next(new ErrorResponse("Address not found or doesn't belong to the user",400 ));
        };

        await ShippingAddress.update({isDefault:false}, {where:{customerId:customerId}});

        address.isDefault = true
        await address.save()

        res.status(200).json({
            success: true,
            message: "The Address was set default"
        });
        
    } catch (error) {
        next(error)
    }
}