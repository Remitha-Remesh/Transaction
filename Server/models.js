const mongoose=require("mongoose")

const ProductSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    category:String,
    dateofSale:Date,
    sold:Boolean,
})
const Product=mongoose.model('Product',ProductSchema)
module.exports=Product