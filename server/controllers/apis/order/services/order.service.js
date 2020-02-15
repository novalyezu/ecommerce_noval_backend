"use strict";

const Order = require("../../../../databases/models/Order");
const OrderItem = require("../../../../databases/models/OrderItem");
const Invoice = require("../../../../databases/models/Invoice");

const getOrder = async order_id => {
  let order = await Order.findByPk(order_id, {
    include: [{ association: "order_item", include: ["product"] }]
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

const updateTotalItem = async (status, total_item, order_id) => {
  let order = await Order.findByPk(order_id);
  let total_now =
    status === "inc"
      ? order.total_item + parseInt(total_item)
      : order.total_item - parseInt(total_item);

  if (total_now > 0) {
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
  } else {
    await Order.destroy({
      where: {
        id_order: order_id
      }
    });
  }

  return;
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

module.exports = {
  getOrder: getOrder,
  addOrderItem: addOrderItem,
  addOrder: addOrder,
  updateTotalItem: updateTotalItem,
  updateOrderItem: updateOrderItem,
  deleteOrderItem: deleteOrderItem
};
