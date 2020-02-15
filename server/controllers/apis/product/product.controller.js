"use strict";

const multer = require("multer");
const upload = multer();
const productService = require("./services/product.service");
const {
  checkToken,
  verifyToken,
  isMerchant
} = require("../../../middlewares/auth.middleware");
let router = require("express").Router();

router.get(
  "/by_merchant/:merchant_id",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let merchant_id = req.params.merchant_id;
    try {
      let products = await productService.getProducts(merchant_id);

      return res.status(200).json({ status: "ok", data: products });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add_new",
  checkToken,
  verifyToken,
  isMerchant,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let product_image = req.files;
    let productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      merchant_id: req.body.merchant_id
    };

    try {
      let newProduct = await productService.addProduct(productData);
      let uploadImage = await productService.uploadImage(
        newProduct.id_product,
        product_image
      );
      let productUpdated = await productService.updateImageUrl(
        newProduct.id_product,
        uploadImage
      );

      return res.status(201).json({
        status: "ok",
        message: "product created!",
        data: productUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:product_id/update_data",
  checkToken,
  verifyToken,
  isMerchant,
  async (req, res, next) => {
    let product_id = req.params.product_id;
    let productData = {
      product_name: req.body.product_name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock
    };

    try {
      let product = await productService.updateProduct(product_id, productData);

      return res
        .status(200)
        .json({ status: "ok", message: "product updated!", data: product });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:product_id/update_image",
  checkToken,
  verifyToken,
  isMerchant,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let product_image = req.files;
    let product_id = req.params.product_id;

    try {
      await productService.deleteImage(product_id);

      let uploadImage = await productService.uploadImage(
        product_id,
        product_image
      );

      let productUpdated = await productService.updateImageUrl(
        product_id,
        uploadImage
      );

      return res.status(200).json({
        status: "ok",
        message: "product updated!",
        data: productUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:product_id",
  checkToken,
  verifyToken,
  isMerchant,
  async (req, res, next) => {
    let product_id = req.params.product_id;
    try {
      await productService.deleteProduct(product_id);
      return res.status(200).json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
