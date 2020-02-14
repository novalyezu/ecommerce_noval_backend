"use strict";

const multer = require("multer");
const upload = multer();
const shippingServiceAdminService = require("./services/shipping-service-admin.service");
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
      let shippingServices = await shippingServiceAdminService.getShippingServices();

      return res.status(200).json({ status: "ok", data: shippingServices });
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
    let shipping_service_logo = req.files;
    let shippingServiceData = {
      service_name: req.body.service_name,
      type: req.body.type,
      price: req.body.price,
      delivery_time: req.body.delivery_time
    };

    try {
      let newShippingService = await shippingServiceAdminService.addShippingService(
        shippingServiceData
      );
      let uploadImage = await shippingServiceAdminService.uploadImage(
        newShippingService.id_shipping_service,
        shipping_service_logo
      );
      let shippingServiceUpdated = await shippingServiceAdminService.updateImageUrl(
        newShippingService.id_shipping_service,
        uploadImage
      );

      return res.status(201).json({
        status: "ok",
        message: "shipping service created!",
        data: shippingServiceUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:shipping_service_id/update_data",
  checkToken,
  verifyToken,
  isAdminEcommerce,
  async (req, res, next) => {
    let shipping_service_id = req.params.shipping_service_id;
    let shippingServiceData = {
      service_name: req.body.service_name,
      type: req.body.type,
      price: req.body.price,
      delivery_time: req.body.delivery_time
    };

    try {
      let shippingService = await shippingServiceAdminService.updateShippingService(
        shipping_service_id,
        shippingServiceData
      );

      return res.status(200).json({
        status: "ok",
        message: "shipping service updated!",
        data: shippingService
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:shipping_service_id/update_image",
  checkToken,
  verifyToken,
  isAdminEcommerce,
  upload.fields([{ name: "image_app" }]),
  async (req, res, next) => {
    let shipping_service_logo = req.files;
    let shipping_service_id = req.params.shipping_service_id;

    try {
      await shippingServiceAdminService.deleteImage(shipping_service_id);

      let uploadImage = await shippingServiceAdminService.uploadImage(
        shipping_service_id,
        shipping_service_logo
      );

      let shippingServiceUpdated = await shippingServiceAdminService.updateImageUrl(
        shipping_service_id,
        uploadImage
      );

      return res.status(200).json({
        status: "ok",
        message: "shipping service updated!",
        data: shippingServiceUpdated
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
