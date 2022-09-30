let express = require('express');
let router = express.Router();

let joi = require('@hapi/joi');

let {Category, CategorySchema} = require('../models/Category.model');

router.get('/:page/:perpage',async (req,res) => {
	let perpage = req.params.perpage;
	let currentpage = req.params.page || 1;
	let records = await Category.find()
                        .skip((perpage*currentpage)- perpage)
                        .limit(perpage);
    let totalRecords = await Category.find().count();
	let totalPages = Math.ceil(totalRecords/perpage);
	res.send({ statusCode:200, statusMessage:'Success', resData:{totalRecords:totalRecords,totalPages:totalPages,data:records }});
});

router.get('/getCategoryById/:id',async (req,res) => {
	let record = await Category.findById(req.params.id);
	if(!record){
		return res.status(403).send({ statusCode:403, statusMessage:'Sorry, Category not found', resData:{}});
	}
	res.send({ statusCode:200, statusMessage:'Success', resData:record });
});

router.post('/saveCategory/', async (req,res) => {	
	let { error } = validateCategory(req.body);
	if (error){
		return res.status(403).send({ statusCode:403, statusMessage:error.details[0].message, resData:{}});
	}
	let data = new Category({
		name:req.body.name
    });
    let item = await data.save();
    res.status(200).send({ statusCode:200, statusMessage:"Category saved successfully.", resData:item })
	
});

router.put('/updateCategory/:id',async (req,res) => {
	let record = await Category.findById(req.params.id);
	if(!record){
		return res.status(403).send({ statusCode:403, statusMessage:'Sorry, Category not found', resData:{} });
    }
    let { error } = validateCategory(req.body);
    if (error){
        return res.status(403).send({ statusCode:403, statusMessage:error.details[0].message, resData:{}});
    }
    record.name = req.body.name;   
    await record.save();
    res.status(200).send({ statusCode:200, statusMessage:'Category updated successfully', resData:record });
});

router.delete('/deleteCategory/:id',async (req,res) => {
	let record = await Category.findByIdAndRemove(req.params.id);
	if(!record){
		return res.status(403).send({ statusCode:403, statusMessage:'Sorry Category not found.', resData:{} });
    }
    res.status(200).send({ statusCode:200, statusMessage:'Category deleted successfully', resData:{} });
});

function validateCategory(CategoryData){
	let schema = joi.object({
		name:joi.string().min(2).max(100).required()
	});
	return schema.validate(CategoryData);
};

module.exports = router;
