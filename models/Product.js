import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    //schema defines our product
    title:{
        //this is for pizza title, each pizza must have a title
        type:String,
        required:true,
        maxlength: 60,
    },
    desc: {
        type: String,
        required: true,
        maxlength: 200,

    },
    //when we can a new pizza we are gonna upload pizza image from our computer
    //for thsi uploading process we are gonna use external cdn service, likke firebase
    //after uploading our file its gonna return us a url which will be a string
    img: {
        type: String,
        required: true,
    },
    prices:{
        //prices can be array but if we put arrray we can write anything in the array
        //like string, boolean. but we want only number so to prevent this we will
        //put specific type
        type: [Number],
        required: true,
    },
    extraOptions:{
        //lets put a text for optiosna adn array for the price number. 

        //putting an object here
        type:  [
            {
                text:{type:String, required:true},
                price:{type:Number, required:true},
            }, 
        ],

    },
//timestamp is for created at date and updated at date
//should use timestamop for all models
},
{timestamps:true}
);

//if we alr have product models then dont creaTE IT AGAIN. "||" sign is for that
//if there is no product in our db then create the model product
export default mongoose.models.Product|| 
mongoose.model("Product", ProductSchema);