const mongoose=require('mongoose');

let CategorySchema = new mongoose.Schema({
	name:{ type:String, required:true },
	createdOn:{ type: Date, default:Date.now() },
	updatedOn:{ type: Date, default:Date.now() }
});
let Category = mongoose.model("Categories", CategorySchema);
module.exports = { CategorySchema , Category };
