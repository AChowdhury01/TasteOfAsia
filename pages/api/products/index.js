import dbConnect from "../../../util/mongo"
import Product from "../../../models/Product"

export default async function handler(req, res) {
    const {method} = req;

    dbConnect()

    if(method == "GET"){
        try{
            //await is for async process. 
            const products = await Product.find(); //fetch all data, so no condition needed.
            res.status(200).json(products);
        }catch(err){
            res.status(500).json(err)
        }
    }
    if(method == "POST"){
        try{
            const product = await Product.create(req.body);
            res.status(201).json(product);

        }catch(err){
            res.status(500).json(err);
        }
    }
  }
  