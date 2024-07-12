import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Loading} from "../components/loading";
import {convertToLocalTime} from "../hooks/useProductSearch";
import {Order} from "../types";
import OrderList from "../components/OrderList";

export function OrderCompletePage(): JSX.Element | null {
  const {id} = useParams<{id: string}>();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          if (response.status === 401) {
            setErrorMessage("Unauthorized");
          } else if (response.status === 404) {
            setErrorMessage("Not Found");
          } else {
            setErrorMessage("Unexpected error occurred");
          }
          return;
        }
        const data: Order = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setErrorMessage("Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <p style={{color: "red"}}>{errorMessage}</p>;
  }

  if (!order) {
    return null;
  }

  const totalQuantity = order.orderDetails.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const totalPrice = order.orderDetails.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <p data-test="order-complete-message">Thank you for your order!</p>
      <div data-test={`order-item-${order.id}`}>
        <p data-test="order-date">
          Order date: {convertToLocalTime(order.createdAt)}
        </p>
        <p data-test="order-total-price">Total price: {totalPrice} coins</p>
        <p data-test="order-total-quantity">Total quantity: {totalQuantity}</p>
        <OrderList orderDetails={order.orderDetails} />
      </div>
    </div>
  );
}
