const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'item',
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    discountPercentage:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    usageLimit:{
        type:String,
        required:true
    },
    usedCount:{
        type:Number,
        default:0
    }
},{timestamps:true});

const PromoCode = mongoose.model("promocode",PromoCodeSchema);

module.exports = PromoCode;