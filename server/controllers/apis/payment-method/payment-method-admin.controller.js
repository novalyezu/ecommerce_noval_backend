"use strict";

const multer = require("multer");
const upload = multer();
const paymentMethodAdminService = require("./services/payment-method-admin.service");
const {
  checkToken,
  verifyToken,
  isAdminEcommerce
} = require("../../../middlewares/auth.middleware");
let router = require("express").Router();

router.get(
  "/",
  checkToken,
  verifyToken,
  isAdminEcommerce,
  async (req, res, next) => {
    try {
      let paymentMethods = await paymentMethodAdminService.getPaymentMethods();

      return res.status(200).json({ status: "ok", data: paymentMethods });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add_new",
  checkToken,
  verifyToken,
  isAdminEcommerce,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let payment_method_logo = req.files;
    let paymentMethodData = {
      payment_method_name: req.body.payment_method_name
    };

    try {
      let newPaymentMethod = await paymentMethodAdminService.addPaymentMethod(
        paymentMethodData
      );
      let uploadImage = await paymentMethodAdminService.uploadImage(
        newPaymentMethod.id_payment_method,
        payment_method_logo
      );
      let paymentMethodUpdated = await paymentMethodAdminService.updateImageUrl(
        newPaymentMethod.id_payment_method,
        uploadImage
      );

      return res.status(201).json({
        status: "ok",
        message: "payment method created!",
        data: paymentMethodUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:payment_method_id/update_data",
  checkToken,
  verifyToken,
  isAdminEcommerce,
  async (req, res, next) => {
    let payment_method_id = req.params.payment_method_id;
    let paymentMethodData = {
      payment_method_name: req.body.payment_method_name
    };

    try {
      let paymentMethod = await paymentMethodAdminService.updatePaymentMethod(
        payment_method_id,
        paymentMethodData
      );

      return res.status(200).json({
        status: "ok",
        message: "payment method updated!",
        data: paymentMethod
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:payment_method_id/update_image",
  checkToken,
  verifyToken,
  isAdminEcommerce,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let payment_method_logo = req.files;
    let payment_method_id = req.params.payment_method_id;

    try {
      await paymentMethodAdminService.deleteImage(payment_method_id);

      let uploadImage = await paymentMethodAdminService.uploadImage(
        payment_method_id,
        payment_method_logo
      );

      let paymentMethodUpdated = await paymentMethodAdminService.updateImageUrl(
        payment_method_id,
        uploadImage
      );

      return res.status(200).json({
        status: "ok",
        message: "payment method updated!",
        data: paymentMethodUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
