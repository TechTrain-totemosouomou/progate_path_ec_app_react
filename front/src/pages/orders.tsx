import {useEffect, useState} from "react";
import {Order} from "../types";
import {Loading} from "../components/loading";
import {convertToLocalTime} from "../hooks/useProductSearch";
import OrderList from "../components/OrderList";

export function OrderPage(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const filteredOrders = orders.filter(order => {
    const orderYear = new Date(order.createdAt).getFullYear();
    return orderYear === selectedYear;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p style={{color: "red"}}>{error}</p>;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - i);

  return (
    <div>
      <h1>Your Orders</h1>
      <select
        data-test="year-selector"
        value={selectedYear}
        onChange={handleYearChange}
      >
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div data-test="order-list">
        {filteredOrders.map(order => {
          const totalQuantity = order.orderDetails.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          const totalPrice = order.orderDetails.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );

          return (
            <div key={order.id} data-test={`order-item-${order.id}`}>
              <p data-test="order-date">
                Order date: {convertToLocalTime(order.createdAt)}
              </p>
              <p data-test="order-total-price">
                Total price: {totalPrice} coins
              </p>
              <p data-test="order-total-quantity">
                Total quantity: {totalQuantity}
              </p>
              <OrderList orderDetails={order.orderDetails} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
