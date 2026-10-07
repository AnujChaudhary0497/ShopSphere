import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrder,
} from "../services/order.api";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await updateOrder(orderId, {
        status: newStatus,
      });

      await fetchOrders();
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert(
        error.message || "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Orders</h1>
        <p>Manage customer orders</p>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h3>All Orders</h3>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="empty-state">
              <p>No orders found</p>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Method</th>
                    <th>Shipping Address</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>

                      <td>{order.userId}</td>

                      <td>
                        ₹
                        {Number(
                          order.totalAmount
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <select
                          className={`order-status-select status-${order.status}`}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingId === order.id
                          }
                        >
                          {statusOptions.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status
                                .charAt(0)
                                .toUpperCase() +
                                status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <span
                          className={`payment-status payment-${order.paymentStatus}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td>{order.paymentMethod}</td>

                      <td>
                        {order.shippingAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}

export default Orders;