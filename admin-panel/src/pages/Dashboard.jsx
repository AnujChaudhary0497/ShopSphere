import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";

import { getDashboardStats } from "../services/dashboard.api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH DASHBOARD STATS
  // =========================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardStats();

      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);

      setError(error.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-page">
      {/* =========================
                DASHBOARD HEADER
            ========================= */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>
      </div>

      {/* =========================
                ERROR
            ========================= */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* =========================
                STATS
            ========================= */}

      <div className="stats-grid">
        {/* TOTAL USERS */}

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div>
            <p>Total Users</p>

            <h2>{loading ? "..." : stats.totalUsers}</h2>
          </div>
        </div>

        {/* TOTAL PRODUCTS */}

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={22} />
          </div>

          <div>
            <p>Total Products</p>

            <h2>{loading ? "..." : stats.totalProducts}</h2>
          </div>
        </div>

        {/* TOTAL ORDERS */}

        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart size={22} />
          </div>

          <div>
            <p>Total Orders</p>

            <h2>{loading ? "..." : stats.totalOrders}</h2>
          </div>
        </div>

        {/* TOTAL REVENUE */}

        <div className="stat-card">
          <div className="stat-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <p>Total Revenue</p>

            <h2>
              {loading
                ? "..."
                : `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`}
            </h2>
          </div>
        </div>
      </div>

      {/* =========================
                RECENT SECTIONS
            ========================= */}

      <div className="dashboard-sections">
        {/* =========================
                RECENT USERS
            ========================= */}

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Users</h3>

            <Link to="/users">View All</Link>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading users...</p>
            </div>
          ) : stats.recentUsers.length === 0 ? (
            <div className="empty-state">
              <Users size={32} />
              <p>No recent users</p>
            </div>
          ) : (
            <div className="recent-list">
              {stats.recentUsers.map((user) => (
                <div className="recent-item" key={user.id}>
                  <div className="recent-item-info">
                    <div className="recent-avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>

                  <div className="recent-item-meta">
                    <span className="role-badge">{user.role}</span>

                    <span
                      className={
                        user.isActive ? "status-active" : "status-inactive"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================
                RECENT PRODUCTS
            ========================= */}

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Products</h3>

            <Link to="/products">View All</Link>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading products...</p>
            </div>
          ) : stats.recentProducts.length === 0 ? (
            <div className="empty-state">
              <Package size={32} />
              <p>No recent products</p>
            </div>
          ) : (
            <div className="recent-list">
              {stats.recentProducts.map((product) => (
                <div className="recent-item" key={product.id}>
                  <div className="recent-item-info">
                    <div className="recent-product-icon">
                      <Package size={20} />
                    </div>

                    <div>
                      <h4>{product.name}</h4>

                      <p>
                        {product.brand} • {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="recent-item-meta">
                    <strong>
                      ₹{Number(product.finalPrice).toLocaleString("en-IN")}
                    </strong>

                    <span
                      className={
                        product.stock > 0 ? "status-active" : "status-inactive"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
