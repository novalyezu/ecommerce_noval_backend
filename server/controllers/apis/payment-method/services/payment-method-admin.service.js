"use strict";

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const uuidv1 = require("uuid/v1");
const moment = require("moment");

const PaymentMethod = require("../../../../databases/models/PaymentMethod");

const getPaymentMethods = async () => {
  let paymentMethods = await PaymentMethod.findAll();

  return paymentMethods;
};

const addPaymentMethod = async paymentMethodData => {
  let paymentMethod = await PaymentMethod.create({
    payment_method_name: paymentMethodData.payment_method_name,
    payment_method_logo: "-"
  });

  return paymentMethod;
};

const updatePaymentMethod = async (payment_method_id, paymentMethodData) => {
  await PaymentMethod.update(
    {
      payment_method_name: paymentMethodData.payment_method_name
    },
    {
      where: {
        id_payment_method: payment_method_id
      }
    }
  );

  let paymentMethod = await PaymentMethod.findByPk(payment_method_id);

  return paymentMethod;
};

const uploadImage = async (payment_method_id, payment_method_logo_image) => {
  let uuid = uuidv1();
  let format = require("util").format;
  let folderName = payment_method_id;
  let payment_method_logo = "-";

  let promiseImageApp = new Promise((resolve, reject) => {
    let fileUploadApp = bucket.file(
      `paymentMethodLogosMysql/${folderName}/image_app.jpg`
    );
    let fileUploadAppName = `paymentMethodLogosMysql%2F${folderName}%2Fimage_app%2Ejpg`;

    fileUploadApp
      .createWriteStream({
        metadata: {
          contentType: payment_method_logo_image.image_app[0].mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .on("finish", () => {
        payment_method_logo = format(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUploadAppName}?alt=media&token=${uuid}`
        );

        resolve();
      })
      .on("error", error => {
        console.log(error);
      })
      .end(payment_method_logo_image.image_app[0].buffer);
  });

  await promiseImageApp;

  return {
    image_app: payment_method_logo
  };
};

const updateImageUrl = async (payment_method_id, payment_method_logo_image) => {
  await PaymentMethod.update(
    {
      payment_method_logo: payment_method_logo_image.image_app
    },
    {
      where: {
        id_payment_method: payment_method_id
      }
    }
  );

  let paymentMethod = await PaymentMethod.findByPk(payment_method_id);

  return paymentMethod;
};

const deleteImage = async payment_method_id => {
  let folderName = payment_method_id;

  await bucket
    .file(`paymentMethodLogosMysql/${folderName}/image_app.jpg`)
    .get()
    .then(async () => {
      await bucket
        .file(`paymentMethodLogosMysql/${folderName}/image_app.jpg`)
        .delete();
      return;
    })
    .catch(err => {
      return;
    });
};

module.exports = {
  getPaymentMethods: getPaymentMethods,
  addPaymentMethod: addPaymentMethod,
  updatePaymentMethod: updatePaymentMethod,
  uploadImage: uploadImage,
  updateImageUrl: updateImageUrl,
  deleteImage: deleteImage
};
