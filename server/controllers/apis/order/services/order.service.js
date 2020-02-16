"use strict";

const Order = require("../../../../databases/models/Order");
const OrderItem = require("../../../../databases/models/OrderItem");
const Invoice = require("../../../../databases/models/Invoice");
const moment = require("moment");

const getDetailOrderUser = async user_id => {
  let order = await Order.findAll({
    where: {
      status: "ongoing",
      user_id: user_id
    },
    include: [
      { association: "merchant", include: ["shipping_service"] },
      { association: "order_item", include: ["product"] }
    ]
  });

  return order;
};

const getOrder = async order_id => {
  let order = await Order.findByPk(order_id, {
    include: [
      { association: "merchant", include: ["shipping_service"] },
      { association: "order_item", include: ["product"] }
    ]
  });

  return order;
};

const addOrder = async orderData => {
  let order = await Order.create({
    total_item: orderData.total_item,
    status: "ongoing",
    merchant_id: orderData.merchant_id,
    shipping_service_id: null,
    user_id: orderData.user_id,
    invoice_id: null
  });

  return order;
};

const addOrderItem = async (order_id, orderData) => {
  let orderItem = await OrderItem.create({
    qty: orderData.qty,
    sub_total: orderData.sub_total,
    product_id: orderData.product_id,
    order_id: order_id
  });

  return orderItem;
};

const updateQty = async (qty, sub_total, order_item_id) => {
  await OrderItem.update(
    {
      qty: qty,
      sub_total: sub_total
    },
    {
      where: {
        id_order_item: order_item_id
      }
    }
  );

  let order_item = OrderItem.findByPk(order_item_id);

  return order_item;
};

const updateTotalItem = async (status, total_item, order_id) => {
  let order = await Order.findByPk(order_id);
  let total_now =
    status === "inc"
      ? order.total_item + parseInt(total_item)
      : order.total_item - parseInt(total_item);

  await Order.update(
    {
      total_item: total_now
    },
    {
      where: {
        id_order: order_id
      }
    }
  );

  return total_now;
};

const updateOrderItem = async orderItemData => {
  await OrderItem.update(
    {
      qty: orderItemData.qty,
      sub_total: orderItemData.sub_total
    },
    {
      where: {
        id_order_item: orderItemData.id_order_item
      }
    }
  );

  return;
};

const deleteOrderItem = async order_item_id => {
  await OrderItem.destroy({
    where: {
      id_order_item: order_item_id
    }
  });

  return;
};

const deleteOrder = async order_id => {
  await Order.destroy({
    where: {
      id_order: order_id
    }
  });

  return;
};

const addInvoice = async (payment_method_id, user_id) => {
  let invoice = await Invoice.create({
    status: "pending",
    bill_total: null,
    payment_date: moment().format(),
    payment_method_id: payment_method_id,
    user_id: user_id
  });

  return invoice;
};

const updateOrder = async (invoice_id, shipping_service_id, order_id) => {
  await Order.update(
    {
      status: "done",
      shipping_service_id: shipping_service_id,
      invoice_id: invoice_id
    },
    {
      where: {
        id_order: order_id
      }
    }
  );

  return;
};

const updateInvoice = async (bill_total, invoice_id) => {
  await Invoice.update(
    {
      bill_total: bill_total
    },
    {
      where: {
        id_invoice: invoice_id
      }
    }
  );

  let invoice = await Invoice.findByPk(invoice_id);

  return invoice;
};

const checkPayment = async invoice_id => {
  await Invoice.update(
    {
      status: "success"
    },
    {
      where: {
        id_invoice: invoice_id
      }
    }
  );

  let invoice = await Invoice.findByPk(invoice_id);

  return invoice;
};

module.exports = {
  getDetailOrderUser: getDetailOrderUser,
  getOrder: getOrder,
  addOrderItem: addOrderItem,
  addOrder: addOrder,
  updateTotalItem: updateTotalItem,
  updateOrderItem: updateOrderItem,
  deleteOrderItem: deleteOrderItem,
  updateQty: updateQty,
  deleteOrder: deleteOrder,
  addInvoice: addInvoice,
  updateOrder: updateOrder,
  updateInvoice: updateInvoice,
  checkPayment: checkPayment
};
