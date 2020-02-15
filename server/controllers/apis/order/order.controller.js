"use strict";

const orderService = require("./services/order.service");
const {
  checkToken,
  verifyToken
} = require("../../../middlewares/auth.middleware");
let router = require("express").Router();

router.post("/add_item", checkToken, verifyToken, async (req, res, next) => {
  let orderData = {
    total_item: req.body.total_item,
    merchant_id: req.body.merchant_id,
    user_id: req.body.user_id,
    qty: req.body.qty,
    sub_total: req.body.sub_total,
    product_id: req.body.product_id,
    order_id: req.body.order_id
  };
  try {
    if (orderData.order_id) {
      await orderService.addOrderItem(orderData.order_id, orderData);
      await orderService.updateTotalItem(
        "inc",
        orderData.total_item,
        orderData.order_id
      );
      let orderDetail = await orderService.getOrder(orderData.order_id);

      return res.status(201).json({ status: "ok", data: orderDetail });
    } else {
      let order = await orderService.addOrder(orderData);
      await orderService.addOrderItem(order.id_order, orderData);
      let orderDetail = await orderService.getOrder(order.id_order);

      return res.status(201).json({ status: "ok", data: orderDetail });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/update_item", checkToken, verifyToken, async (req, res, next) => {
  let order_item_data = req.body.order_item_data;

  try {
    for (let i = 0; i < order_item_data.length; i++) {
      await orderService.updateOrderItem(order_item_data[i]);
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/delete_item/:order_item_id",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let order_item_id = req.params.order_item_id;
    let orderItemData = {
      total_item: req.body.total_item,
      order_id: req.body.order_id
    };
    try {
      await orderService.deleteOrderItem(order_item_id);
      await orderService.updateTotalItem(
        "dec",
        orderItemData.total_item,
        orderItemData.order_id
      );

      return res.status(200).json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
