"use strict";

const multer = require("multer");
const upload = multer();
const merchantService = require("./services/merchant.service");
const {
  checkToken,
  verifyToken,
  isMerchant
} = require("../../../middlewares/auth.middleware");
let router = require("express").Router();

router.get(
  "/:merchant_id/detail",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let merchant_id = req.params.merchant_id;
    try {
      let merchant = await merchantService.getMerchant(merchant_id);

      return res.status(200).json({ status: "ok", data: merchant });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/register",
  checkToken,
  verifyToken,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let merchant_logo = req.files;
    let merchantData = {
      merchant_name: req.body.merchant_name,
      description: req.body.description,
      address: req.body.address,
      user_id: req.body.user_id
    };

    try {
      let newMerchant = await merchantService.addMerchant(merchantData);
      let uploadImage = await merchantService.uploadImage(
        newMerchant.id_merchant,
        merchant_logo
      );
      let merchantUpdated = await merchantService.updateImageUrl(
        newMerchant.id_merchant,
        uploadImage
      );

      return res.status(201).json({
        status: "ok",
        message: "merchant created!",
        data: merchantUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:merchant_id/update_data",
  checkToken,
  verifyToken,
  isMerchant,
  async (req, res, next) => {
    let merchant_id = req.params.merchant_id;
    let merchantData = {
      merchant_name: req.body.merchant_name,
      description: req.body.description,
      address: req.body.address
    };

    try {
      let merchant = await merchantService.updateMerchant(
        merchant_id,
        merchantData
      );

      return res
        .status(201)
        .json({ message: "merchant updated!", data: merchant });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:merchant_id/update_image",
  checkToken,
  verifyToken,
  isMerchant,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let merchant_logo = req.files;
    let merchant_id = req.params.merchant_id;

    try {
      await merchantService.deleteImage(merchant_id);

      let uploadImage = await merchantService.uploadImage(
        merchant_id,
        merchant_logo
      );

      let merchantUpdated = await merchantService.updateImageUrl(
        merchant_id,
        uploadImage
      );

      return res
        .status(200)
        .json({ message: "merchant updated!", data: merchantUpdated });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
