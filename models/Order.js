import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    //schema defines our order
    customer:{
        //this is for customer info
        type:String,
        required:true,
        maxlength: 60,
    },
    address: {
        type: String,
        required: true,
        maxlength: 200,

    },

    total: {
        type: Number,
        required: true,
    },
    status:{
        //we have 4 status=> payment, preparing, on the way, delivered. 
        type: Number,
        default: 0, //bc when we create new order its gonna be status 0
    },
    method: {
        type: Number, //when pay with cash it's 0 and when paypal its 
        required:true
    },


//timestamp is for created at date and updated at date
//should use timestamop for all models
},
{timestamps:true}
);

//if we alr have product models then dont creaTE IT AGAIN. "||" sign is for that
//if there is no product in our db then create the model product
export default mongoose.models.Order|| 
mongoose.model("Order", OrderSchema);