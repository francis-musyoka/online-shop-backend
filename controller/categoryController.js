
const db = require("../utils/database");
const ErrorResponse = require('../utils/error');
const { v4: uuidv4 } = require('uuid');

const{Category} = db;

exports.addCategory = async(req,res,next)=>{
    const {name} =req.body;
    const id = uuidv4().replace(/-/g, "")
console.log(name);

    try {
        const isCategoryExist = await Category.findOne({where:{name:name}});

        if(isCategoryExist){
            return next(new ErrorResponse(`This category (${name}) already exist`, 400));
        };

        await Category.create({id:id, name:name});

        res.status(201).json({
            success: true,
            msg: 'Category was created successfully'
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