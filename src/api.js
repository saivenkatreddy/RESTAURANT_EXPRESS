// Imports
const serverless = require("serverless-http");
const express = require('express');
const app = express();

// Axios
const axios = require('axios');

// CORS
const cors = require('cors');

// Middleware for JSON data recieving
app.use(express.json());
app.use(cors());

// ENV
const dotenv = require('dotenv');
dotenv.config();

// Mongoose 
const mongoose = require('mongoose');
const DB = process.env.DATABASE;
mongoose.connect(DB).then(()=>{
    console.log('DB is connected')
}).catch((err)=>{
    console.log(err);
});

// Required JSON Format
/*  Food Schema
    {
     food       : "String",
     price      : "Number",
     Category   : "String",
     link       : "String",
     description: " String";
    }

    Order Schema
    {
     User     : String,
     food     : String,
     qty      : Number,
     Location : String,
    }
 */

// Food    
// Food Schema
const foodSchema = new mongoose.Schema({
     food       : String,
     price      : Number,
     Category   : String,
     link       : String,
     description: String
  });

// Food Modal
const foodModal = mongoose.model('Food',foodSchema);  

// ORDERS
// Order Schema
const orderSchema = new mongoose.Schema({
     User     : String,
     food     : Array,
     Location : String,
 });

// Order Modal
const orderModal = mongoose.model('Orders',orderSchema);   

// Routes

// FOODS
// Create
app.post('/foods/create',async(req,res)=>{

    const _body = req.body;

    const _food        = _body.food;
    const _price       = _body.price;
    const _category    = _body.Category;
    const _link        = _body.link;
    const _description = _body.description;

    // const _food        = "Chicken";
    // const _price       =  100;
    // const _category    = "indian";
    // const _link        = "https://cdn.vox-cdn.com/thumbor/aNM9cSJCkTc4-RK1avHURrKBOjU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/20059022/shutterstock_1435374326.jpg";
    // const _description = "description";


    const newdata = new foodModal({

     food       : _food,
     price      : _price,
     Category   : _category,
     link       : _link,
     description: _description

    });

    newdata.save();

    const reqData = await foodModal.find();
    res.send(reqData);
})

// Read all
app.get('/foods/all',async(req,res)=>{

    const reqData = await foodModal.find();
    res.send(reqData);

})

// ORDERS
// Create
app.post('/orders/create',async(req,res)=>{

    const _body = req.body;

    //  const _user = _body.user;
    //  const _food = _body.food;
    //  const _location = _body.location;

    const _user = "Sai";
    const _food = [
                    {food:"Chicken",qty:1},
                    {food:"New",qty:2}
                  ];
    const _location = "NR2 4QG";


    const newdata = new orderModal({

        User     : _user,
        food     : _food,
        Location : _location,

    });

    newdata.save();

    res.send("Succesfully added data");
})

// Read all
app.get('/orders/all',async(req,res)=>{

    const reqData = await orderModal.find();
    res.send(reqData);

})

// Read by order

// Update

// Delete


// app.listen(8081,()=>{
//     console.log(`http://localhost:8081`);
// })


//netlify way to start server
const handler = serverless(app);

module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result;
}