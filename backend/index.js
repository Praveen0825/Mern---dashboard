const express=require('express');
const cors = require("cors");
require('./db/config');
const User=require('./db/User');
const Product = require('./db/Product')
const jwt=require('jsonwebtoken');
const app = express();
require('dotenv').config();
const jwtKey=process.env.JWTKEY;

app.use(express.json());
app.use(cors());
app.post("/register",async(req,res)=>{
    let user=new User(req.body);
    let result =await user.save();
    result = result.toObject();
    //console.log(result.email)
    delete result.password
    jwt.sign({result}, jwtKey,{expiresIn: "2h"}, (err,token) => {
        if(err){
            res.send({result:"Something went wrong, please try after sometime"})
        }
        res.send({result,auth: token})
    })
});

app.post("/login", async(req,res)=>{
    //console.log(req.body);
    if(req.body.password &&req.body.email){
        let user=await User.findOne(req.body).select("-password");
        if(user)
        {
            jwt.sign({user}, jwtKey,{expiresIn: "2h"}, (err,token)=>{
                if(err){
                    res.send({result:"Something went wrong, please try after sometime"})
                }
            //console.log(token)
                res.send({user,auth: token})
            })
        }
        else{
            res.send({result:"No User Found"})
        }
    }
    else{
        res.send({result:"No User Found"})  
    }   
});

app.post("/add-product",verifyToken,async (req,res)=>{
    let product =new Product(req.body);
    let result = await product.save();
    res.send(result)
});

app.get("/products",verifyToken,async(req,res)=>{
let products=await Product.find();
if(products.length>0){
    console.log(products)
    res.send(products)
    
} 
else{
    res.send({result: "No Products found"})
}
});

app.delete("/product/:id",verifyToken,async (req,res)=>{
    let result = await Product.deleteOne({_id:req.params.id})
    res.send(result); 
})

app.get("/product/:id",verifyToken, async (req,res) =>{
    let result = await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }else{
        res.send({"result":"No Record Found for this product"})
    }
})

app.put("/product/:id",verifyToken, async(req,res)=>{
    let result = await Product.updateOne( 
        {_id: req.params.id},
        { $set : req.body}
    )
    res.send(result)

})

app.get("/search/:key", verifyToken ,async (req,res)=>{
    let result=await Product.find({
        "$or": [
            {name: {$regex: req.params.key }},
            {company: {$regex: req.params.key }},
            {category: {$regex: req.params.key }}
           
        ]
    })
    res.send(result)
})

function verifyToken(req,res,next){
    let token= req.headers['authorization'];
    if(token){
        token=token.split(' ')[0];
        console.warn("middleware called",token)
        jwt.verify(token,jwtKey, (err,valid)=>{
            if(err){
                console.log("ERROR OCCUR")
                res.status(401).send({result: "Please provide valid token "})
            }else{
                console.log("NO ERROR OCCUR")
              next();
            }
            
        })
    }
    else{
        res.status(401).send({result: "Please add token with header"})
    }
    next();
}

app.listen(5000)