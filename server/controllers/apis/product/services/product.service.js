"use strict";

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const uuidv1 = require("uuid/v1");
const moment = require("moment");

const Product = require("../../../../databases/models/Product");

const getProductsMerchant = async merchant_id => {
  let products = await Product.findAll({
    where: {
      merchant_id: merchant_id,
      is_active: true
    }
  });

  return products;
};

const getProducts = async (start_at, limit, sort_by_harga) => {
  if (sort_by_harga === "kosong") {
    let products = await Product.findAll({
      where: {
        is_active: true
      },
      offset: start_at,
      limit: limit
    });

    return products;
  } else {
    let sort = sort_by_harga === "termurah" ? "ASC" : "DESC";
    let products = await Product.findAll({
      where: {
        is_active: true
      },
      order: [["price", sort]],
      offset: start_at,
      limit: limit
    });

    return products;
  }
};

const getProduct = async product_id => {
  let product = await Product.findByPk(product_id, {
    include: ["merchant"]
  });

  return product;
};

const addProduct = async productData => {
  let product = await Product.create({
    product_name: productData.product_name,
    product_image: "-",
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    is_active: true,
    merchant_id: productData.merchant_id
  });

  return product;
};

const updateProduct = async (product_id, productData) => {
  await Product.update(
    {
      product_name: productData.product_name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock
    },
    {
      where: {
        id_product: product_id
      }
    }
  );

  let product = await Product.findByPk(product_id);

  return product;
};

const uploadImage = async (product_id, product_image_file) => {
  let uuid = uuidv1();
  let format = require("util").format;
  let folderName = product_id;
  let product_image = "-";

  let promiseImageApp = new Promise((resolve, reject) => {
    let fileUploadApp = bucket.file(
      `productImagesMysql/${folderName}/image_app.jpg`
    );
    let fileUploadAppName = `productImagesMysql%2F${folderName}%2Fimage_app%2Ejpg`;

    fileUploadApp
      .createWriteStream({
        metadata: {
          contentType: product_image_file.image_app[0].mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .on("finish", () => {
        product_image = format(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUploadAppName}?alt=media&token=${uuid}`
        );

        resolve();
      })
      .on("error", error => {
        console.log(error);
      })
      .end(product_image_file.image_app[0].buffer);
  });

  await promiseImageApp;

  return {
    image_app: product_image
  };
};

const updateImageUrl = async (product_id, product_image) => {
  await Product.update(
    {
      product_image: product_image.image_app
    },
    {
      where: {
        id_product: product_id
      }
    }
  );

  let productData = await Product.findByPk(product_id);

  return productData;
};

const deleteImage = async product_id => {
  let folderName = product_id;

  await bucket
    .file(`productImagesMysql/${folderName}/image_app.jpg`)
    .get()
    .then(async () => {
      await bucket
        .file(`productImagesMysql/${folderName}/image_app.jpg`)
        .delete();
      return;
    })
    .catch(err => {
      return;
    });
};

const deleteProduct = async product_id => {
  await Product.update(
    {
      is_active: false
    },
    {
      where: {
        id_product: product_id
      }
    }
  );

  return;
};

module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
  getProductsMerchant: getProductsMerchant,
  addProduct: addProduct,
  updateProduct: updateProduct,
  uploadImage: uploadImage,
  updateImageUrl: updateImageUrl,
  deleteImage: deleteImage,
  deleteProduct: deleteProduct
};
