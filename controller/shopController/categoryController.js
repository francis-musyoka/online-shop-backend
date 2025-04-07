
const { createId } = require("../../utils");
const db = require("../../utils/database");
const ErrorResponse = require('../../utils/error');

const{Category} = db;

exports.addCategory = async(req,res,next)=>{
    const {name} =req.body;
    const id = createId()

    try {
        const isCategoryExist = await Category.findOne({where:{name:name}});

        if(isCategoryExist){
            return next(new ErrorResponse(`This category (${name}) already exist`, 400));
        };

        await Category.create({id:id, name:name});

        res.status(201).json({
            success: true,
            message: 'Category was created successfully'
        })
    } catch (error) {
        next(error)
    }
};

exports.getAllCategories = async(req,res,next)=>{
    try {
        const categories= await Category.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.status(200).json({
            success: true,
            categories: categories
        })
    } catch (error) {
        next(error)
    }
};