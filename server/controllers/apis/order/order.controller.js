"use strict";

const orderService = require("./services/order.service");
const {
  checkToken,
  verifyToken
} = require("../../../middlewares/auth.middleware");
let router = require("express").Router();

router.get(
  "/detail/by_user/:user_id",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let user_id = req.params.user_id;
    try {
      let detailOrder = await orderService.getDetailOrderUser(user_id);

      return res.status(200).json({ status: "ok", data: detailOrder });
    } catch (error) {
      next(error);
    }
  }
);

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

router.post(
  "/update_qty/:order_item_id",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let order_item_id = req.params.order_item_id;
    let qty = req.body.qty;
    let sub_total = req.body.sub_total;
    try {
      let order_item = await orderService.updateQty(
        qty,
        sub_total,
        order_item_id
      );

      return res.status(200).json({
        status: "ok",
        data: { order_item_id, qty, sub_total, order_id: order_item.order_id }
      });
    } catch (error) {
      next(error);
    }
  }
);

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
      let total_now = await orderService.updateTotalItem(
        "dec",
        orderItemData.total_item,
        orderItemData.order_id
      );

      return res.status(200).json({
        status: "ok",
        data: { order_item_id, total_now, order_id: orderItemData.order_id }
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete_order/:order_id",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let order_id = req.params.order_id;
    try {
      await orderService.deleteOrder(order_id);

      return res.status(200).json({ status: "ok", data: { order_id } });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/payment", checkToken, verifyToken, async (req, res, next) => {
  let payment_method_id = req.body.payment_method_id;
  let user_id = req.body.user_id;
  let order_data = req.body.order_data;

  try {
    let invoice = await orderService.addInvoice(payment_method_id, user_id);
    let bill_total = 0;
    for (let i = 0; i < order_data.length; i++) {
      for (let j = 0; j < order_data[i].order_item.length; j++) {
        bill_total += order_data[i].order_item[j].sub_total;
      }
      await orderService.updateOrder(
        invoice.id_invoice,
        order_data[i].shipping_service_selected.id_shipping_service,
        order_data[i].id_order
      );
      bill_total += order_data[i].shipping_service_selected.price;
    }
    let invoiceUpdated = await orderService.updateInvoice(
      bill_total,
      invoice.id_invoice
    );

    return res.status(200).json({ status: "ok", data: invoiceUpdated });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/payment/:invoice_id/check",
  checkToken,
  verifyToken,
  async (req, res, next) => {
    let invoice_id = req.params.invoice_id;
    try {
      let invoice = await orderService.checkPayment(invoice_id);

      return res.status(200).json({ status: "ok", data: invoice });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
