import React from "react";
import {OrderDetail} from "../types";

interface OrderListProps {
  orderDetails: OrderDetail[];
}

const OrderList: React.FC<OrderListProps> = ({orderDetails}) => {
  return (
    <>
      {orderDetails.map(item => (
        <div key={item.id} data-test="order-detail-item">
          <img
            data-test="order-detail-image"
            src={`/image/${item.product.imageName}`}
            alt={item.product.name}
          />
          <div>
            <h2 data-test="order-detail-name">{item.product.name}</h2>
            <p data-test="order-detail-price">price: {item.price} coins</p>
            <p data-test="order-detail-quantity">quantity: {item.quantity}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderList;
