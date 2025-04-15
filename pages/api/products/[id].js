import dbConnect from "../../../util/mongo"
import Product from "../../../models/Product"

export default async function handler(req, res) {
    const {
        method,
        query: {id},
     } = req;

    dbConnect()

    if(method == "GET"){
        try{
            //await is for async process. 
            const product = await Product.findById(id); //fetch all data, so no condition needed.
            res.status(200).json(product);
        }catch(err){
            res.status(500).json(err)
        }
    }
    //PUT is for updating our pizza
    if(method == "PUT"){
        try{
            const product = await Product.create(req.body);
            res.status(201).json(product);

        }catch(err){
            res.status(500).json(err);
        }
    }
//for deleting pizzas. 
    if(method == "DELETE"){
        try{
            const product = await Product.create(req.body);
            res.status(201).json(product);

        }catch(err){
            res.status(500).json(err);
        }
    }
  }
  