var express = require("express");
var router = express.Router();
const salesModel = require("../models/sales.model");
const productModel = require("../models/product.model");
const { jwtAuth } = require("../middlewares/auth.middleware");

router.post("/", jwtAuth, async (req, res, next) => {
  try {
    const { id } = req.body;

    const product = await productModel.findOne({ _id: id });
    await salesModel.create({
      product:product.name,
      user:res.locals.user.username,
      date: new Date()
    });
    
    await productModel.findOneAndUpdate(
        { _id: product },
        {
          $set: {
            stock:product.stock===0 ? 0 : product.stock-1
          }
        },
        { useFindAndModify: false }
      );

    res.status(200).json({ message: "Buy succesful" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error buying" });
  }
});

router.get("/", jwtAuth, (req, res, next) => {
    salesModel
      .find()
      .then(sales => res.status(200).json(sales))
      .catch(err => res.status(500).json({ message: err }));
  });


  router.get("/data", async (req, res, next) => {
    
    try {
      const data = await salesModel.aggregate(
        [
         {
           $project: {
             year: {$year: '$date'},
             month: {$month: '$date'},
             dayOfMonth: {$dayOfMonth: '$date'}
           }
         },{
           $group: {
             _id:{
               year: '$year',
               month: '$month',
               dayOfMonth: '$dayOfMonth'
             },
             count: {
               $sum: 1
             }
           }
         },
         { $sort: { _id: 1 } }
        ]
       )
       const products = await salesModel.aggregate(
        [
         {
           $group: {
             _id:{
               product: '$product'
             },
             count: {
               $sum: 1
             }
           }
         }
        ]
       )
      res.status(200).json({data,products})
    } catch (error) {
      res.status(500).json({ message: error })
    }
  });


module.exports = router;