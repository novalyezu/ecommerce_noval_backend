"use strict";

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const uuidv1 = require("uuid/v1");
const moment = require("moment");

const ShippingService = require("../../../../databases/models/ShippingService");

const getShippingServices = async () => {
  let shippingServices = await ShippingService.findAll();

  return shippingServices;
};

const addShippingService = async shippingServiceData => {
  let shippingService = await ShippingService.create({
    service_name: shippingServiceData.service_name,
    service_logo: "-",
    type: shippingServiceData.type,
    price: shippingServiceData.price,
    delivery_time: shippingServiceData.delivery_time
  });

  return shippingService;
};

const updateShippingService = async (
  shipping_service_id,
  shippingServiceData
) => {
  await ShippingService.update(
    {
      service_name: shippingServiceData.service_name,
      type: shippingServiceData.type,
      price: shippingServiceData.price,
      delivery_time: shippingServiceData.delivery_time
    },
    {
      where: {
        id_shipping_service: shipping_service_id
      }
    }
  );

  let shippingService = await ShippingService.findByPk(shipping_service_id);

  return shippingService;
};

const uploadImage = async (
  shipping_service_id,
  shipping_service_logo_image
) => {
  let uuid = uuidv1();
  let format = require("util").format;
  let folderName = shipping_service_id;
  let service_logo = "-";

  let promiseImageApp = new Promise((resolve, reject) => {
    let fileUploadApp = bucket.file(
      `shippingServiceLogosMysql/${folderName}/image_app.jpg`
    );
    let fileUploadAppName = `shippingServiceLogosMysql%2F${folderName}%2Fimage_app%2Ejpg`;

    fileUploadApp
      .createWriteStream({
        metadata: {
          contentType: shipping_service_logo_image.image_app[0].mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .on("finish", () => {
        service_logo = format(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUploadAppName}?alt=media&token=${uuid}`
        );

        resolve();
      })
      .on("error", error => {
        console.log(error);
      })
      .end(shipping_service_logo_image.image_app[0].buffer);
  });

  await promiseImageApp;

  return {
    image_app: service_logo
  };
};

const updateImageUrl = async (
  shipping_service_id,
  shipping_service_logo_image
) => {
  await ShippingService.update(
    {
      service_logo: shipping_service_logo_image.image_app
    },
    {
      where: {
        id_shipping_service: shipping_service_id
      }
    }
  );

  let shippingService = await ShippingService.findByPk(shipping_service_id);

  return shippingService;
};

const deleteImage = async shipping_service_id => {
  let folderName = shipping_service_id;

  await bucket
    .file(`shippingServiceLogosMysql/${folderName}/image_app.jpg`)
    .get()
    .then(async () => {
      await bucket
        .file(`shippingServiceLogosMysql/${folderName}/image_app.jpg`)
        .delete();
      return;
    })
    .catch(err => {
      return;
    });
};

module.exports = {
  getShippingServices: getShippingServices,
  addShippingService: addShippingService,
  updateShippingService: updateShippingService,
  uploadImage: uploadImage,
  updateImageUrl: updateImageUrl,
  deleteImage: deleteImage
};
