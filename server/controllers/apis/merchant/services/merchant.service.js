"use strict";

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const uuidv1 = require("uuid/v1");
const moment = require("moment");

const Merchant = require("../../../../databases/models/Merchant");
const User = require("../../../../databases/models/User");

const getMerchant = async merchant_id => {
  let merchant = await Merchant.findByPk(merchant_id);

  return merchant;
};

const addMerchant = async merchantData => {
  let merchant = await Merchant.create({
    merchant_name: merchantData.merchant_name,
    merchant_logo: "-",
    description: merchantData.description,
    address: merchantData.address,
    open_date: moment().format(),
    user_id: merchantData.user_id
  });

  await User.update(
    {
      role: "merchant"
    },
    {
      where: {
        id_user: merchantData.user_id
      }
    }
  );

  return merchant;
};

const updateMerchant = async (merchant_id, merchantData) => {
  await Merchant.update(
    {
      merchant_name: merchantData.merchant_name,
      description: merchantData.description,
      address: merchantData.address
    },
    {
      where: {
        id_merchant: merchant_id
      }
    }
  );

  let merchant = await Merchant.findByPk(merchant_id);

  return merchant;
};

const uploadImage = async (merchant_id, merchant_logo_image) => {
  let uuid = uuidv1();
  let format = require("util").format;
  let folderName = merchant_id;
  let merchant_logo = "-";

  let promiseImageApp = new Promise((resolve, reject) => {
    let fileUploadApp = bucket.file(
      `merchantLogosMysql/${folderName}/image_app.jpg`
    );
    let fileUploadAppName = `merchantLogosMysql%2F${folderName}%2Fimage_app%2Ejpg`;

    fileUploadApp
      .createWriteStream({
        metadata: {
          contentType: merchant_logo_image.image_app[0].mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .on("finish", () => {
        merchant_logo = format(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUploadAppName}?alt=media&token=${uuid}`
        );

        resolve();
      })
      .on("error", error => {
        console.log(error);
      })
      .end(merchant_logo_image.image_app[0].buffer);
  });

  await promiseImageApp;

  return {
    image_app: merchant_logo
  };
};

const updateImageUrl = async (merchant_id, merchant_logo_image) => {
  await Merchant.update(
    {
      merchant_logo: merchant_logo_image.image_app
    },
    {
      where: {
        id_merchant: merchant_id
      }
    }
  );

  let merchantData = await Merchant.findByPk(merchant_id);

  return merchantData;
};

const deleteImage = async merchant_id => {
  let folderName = merchant_id;

  await bucket
    .file(`merchantLogosMysql/${folderName}/image_app.jpg`)
    .get()
    .then(async () => {
      await bucket
        .file(`merchantLogosMysql/${folderName}/image_app.jpg`)
        .delete();
      return;
    })
    .catch(err => {
      return;
    });
};

module.exports = {
  getMerchant: getMerchant,
  addMerchant: addMerchant,
  updateMerchant: updateMerchant,
  uploadImage: uploadImage,
  updateImageUrl: updateImageUrl,
  deleteImage: deleteImage
};
