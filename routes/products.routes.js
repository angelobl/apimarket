var express = require("express");
var router = express.Router();
const productModel = require("../models/product.model");
const { jwtAuth } = require("../middlewares/auth.middleware");
const aws = require('aws-sdk')

aws.config.update({
  secretAccessKey: process.env.SECRET_KEY ,
  accessKeyId: process.env.ACCESS_KEY,
  region: 'us-east-2'
});

const s3 = new aws.S3()

router.post("/", jwtAuth, async (req, res, next) => {
  try {
    const { name, price, image, video, stock } = req.body;

    const product = await productModel.create({
      name,
      price,
      stock,
      owner: res.locals.user.username,
      image: {
        data: image,
        contentType: ""
      },
      video: {
        data: video,
        contentType: ""
      }
    });

    res.status(200).json({ message: "Product Added" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error adding product" });
  }
});

router.get("/", jwtAuth, (req, res, next) => {
  productModel
    .find()
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json({ message: err }));
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id });
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: "Producto no encontrado" });
  }
});

router.put("/", jwtAuth, async (req, res, next) => {
  try {
    if (res.locals.user.username !== req.body.owner) {
      res.status(500).json({ message: "Usuario no es owner" });
    } else {
      if (!req.body.image && !req.body.video) {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              stock:req.body.stock
            }
          },
          { useFindAndModify: false }
        );
        console.log("ninguno existe");
        res.status(200).json({ message: "Producto actualizado" });
      } else if (!req.body.image) {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              stock:req.body.stock,
              video: {
                data: req.body.video,
                contentType: ""
              }
            }
          },
          { useFindAndModify: false }
        );
        console.log("imagen no existe");
        res.status(200).json({ message: "Producto actualizado" });
      } else if (!req.body.video) {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              stock:req.body.stock,
              image: {
                data: req.body.image,
                contentType: ""
              }
            }
          },
          { useFindAndModify: false }
        );
        console.log("video no existe");
        res.status(200).json({ message: "Producto actualizado" });
      } else {
        await productModel.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              stock:req.body.stock,
              image: {
                data: req.body.image,
                contentType: ""
              },
              video: {
                data: req.body.video,
                contentType: ""
              }
            }
          },
          { useFindAndModify: false }
        );
        console.log("todos existen");
        res.status(200).json({ message: "Producto actualizado" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Producto no encontrado" });
  }
});


router.post("/generateUrl",jwtAuth, async(req, res, next) => {
  const {Bucket, Key, type} = req.body
  let params = {
    Bucket,
    Key,
    ContentType:type
  }
  // funcion para verificar si puedo subir al Key => pathfile
  try {
    const signedUrl = await s3.getSignedUrl('putObject',params)
    const url = `https://${Bucket}.s3.${s3.config.region}.amazonaws.com/${Key}`

  res.status(200).json({ signedUrl, url })
  } catch (error) {
    res.status(500).json({ message: error })
  }
  
  
})

router.delete("/", jwtAuth, async (req, res, next) => {
  try {
    if (res.locals.user.username === req.body.owner) {
      await productModel.findOneAndDelete({ _id: req.body.id });
      res.status(200).json({ message: "Producto eliminado" });
    } else res.status(500).json({ message: "Usuario no es owner" });
  } catch (e) {
    res.status(500).json({ message: "Producto no encontrado" });
  }
});

module.exports = router;
