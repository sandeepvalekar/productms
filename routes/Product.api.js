let express = require('express');
let router = express.Router();

let joi = require('@hapi/joi');

let Product = require('../models/Product.model');

router.get('/:page/:perpage',async (req,res) => {
    let perpage = req.params.perpage;
	let currentpage = req.params.page || 1;
	let records = await Product.find()
                        .skip((perpage*currentpage)- perpage)
                        .limit(perpage);
    let totalRecords = await Product.find().count();
	let totalPages = Math.ceil(totalRecords/perpage);
	res.send({ statusCode:200, statusMessage:'Success', resData:{totalRecords:totalRecords,totalPages:totalPages,data:records }});
});

router.get('/getProductById/:id',async (req,res) => {
	let record = await Product.findById(req.params.id);
	if(!record){
		return res.status(403).send({ statusCode:403, statusMessage:'Sorry, Product not found', resData:{}});
	}
	res.send({ statusCode:200, statusMessage:'Success', resData:record });
});

// router.get('/getProductByCategory/:category',async (req,res) => {
// 	let record = await Product.find(item => item.category.name == req.params.category);
// 	if(!record){
// 		return res.status(403).send({ statusCode:403, statusMessage:'Sorry, Product not found', resData:{}});
// 	}
// 	res.send({ statusCode:200, statusMessage:'Success', resData:record });
// });

router.post('/saveProduct/', async (req,res) => {	
	let { error } = validateProduct(req.body);
	if (error){
		return res.status(403).send({ statusCode:403, statusMessage:error.details[0].message, resData:{}});
	}
	let data = new Product({
		name:req.body.name,
        category:req.body.category
    });
    let item = await data.save();
    res.status(200).send({ statusCode:200, statusMessage:"Product saved successfully.", resData:item })
	
});

router.put('/updateProduct/:id',async (req,res) => {
	let record = await Product.findById(req.params.id);
	if(!record){
		return res.status(403).send({ statusCode:403, statusMessage:'Sorry, Product not found', resData:{} });
    }
    let { error } = validateProduct(req.body);
    if (error){
        return res.status(403).send({ statusCode:403, statusMessage:error.details[0].message, resData:{}});
    }
    record.name = req.body.name;
    record.category = req.body.category;    
    await record.save();
    res.status(200).send({ statusCode:200, statusMessage:'Product updated successfully', resData:record });
});

router.delete('/deleteProduct/:id',async (req,res) => {
	let record = await Product.findByIdAndRemove(req.params.id);
	if(!record){
		return res.status(403).send({ statusCode:403, statusMessage:'Sorry Product not found.', resData:{} });
    }
    res.status(200).send({ statusCode:200, statusMessage:'Product deleted successfully', resData:{} });
});

function validateProduct(ProductData){
	let schema = joi.object({
		name:joi.string().min(2).max(100).required(),        
        category:{
            name:joi.string().min(2).max(100).required()
        }
	});
	return schema.validate(ProductData);
};

module.exports = router;
