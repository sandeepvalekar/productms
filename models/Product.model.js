const mongoose=require('mongoose');

let {CategorySchema} = require('./Category.model');

let ProductSchema = new mongoose.Schema({
	name:{ type:String, required:true },
	category:CategorySchema,
	createdOn:{ type: Date, default:Date.now() },
	updatedOn:{ type: Date, default:Date.now() }
});
let ProductModel = mongoose.model("Products", ProductSchema);
module.exports = ProductModel;