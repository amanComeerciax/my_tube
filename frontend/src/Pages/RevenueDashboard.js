import React, { useState, useEffect, useContext } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiDollarSign, FiTrendingUp, FiEye, FiMousePointer,
  FiBarChart2, FiTarget, FiActivity, FiPieChart,
  FiRefreshCw, FiDownload, FiCalendar
} from "react-icons/fi";

export default function RevenueDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [timeRange, setTimeRange] = useState("all"); // all, today, week, month

  useEffect(() => {
    fetchDashboardData();
    fetchCategoryData();
  }, []);

  /* ================= FETCH DASHBOARD DATA ================= */
  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/api/ads/dashboard/revenue", {
        
      });
      setDashboardData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
      setLoading(false);
    }
  };

  /* ================= FETCH CATEGORY DATA ================= */
  const fetchCategoryData = async () => {
    try {
      const res = await api.get("/api/ads/dashboard/category-revenue", {
        
      });
      setCategoryData(res.data);
    } catch (err) {
      console.error("Failed to fetch category data:", err);
    }
  };

  /* ================= REFRESH DATA ================= */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    await fetchCategoryData();
    setRefreshing(false);
  };

  /* ================= EXPORT DATA ================= */
  const handleExport = () => {
    if (!dashboardData) return;

    const csvContent = [
      ["Ad Title", "Views", "Clicks", "CTR", "CPM", "CPC", "Revenue"],
      ...dashboardData.adBreakdown.map(ad => [
        ad.title,
        ad.views,
        ad.clicks,
        ad.ctr + "%",
        "₹" + ad.cpm,
        "₹" + ad.cpc,
        "₹" + ad.revenue
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad-revenue-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  /* ================= HELPERS ================= */
  const formatCurrency = (amount) => {
    return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Please login to view revenue dashboard</h2>
          <button onClick={() => navigate("/login")} style={styles.button}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div className="spinner"></div>
          <p style={{ marginTop: 16, color: "#888" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { overview, topPerformers, adBreakdown } = dashboardData || {};

  return (
    <div style={styles.container}>
      <div style={styles.fullWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.mainTitle}>💰 Ad Revenue Dashboard</h1>
            <p style={styles.subtitle}>Track your advertising performance and earnings</p>
          </div>
          <div style={styles.headerActions}>
            <button 
              onClick={handleRefresh} 
              style={styles.refreshButton}
              disabled={refreshing}
            >
              <FiRefreshCw size={18} className={refreshing ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button onClick={handleExport} style={styles.exportButton}>
              <FiDownload size={18} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon} className="gradient-bg-1">
              <FiDollarSign size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Revenue</div>
              <div style={styles.statValue}>{formatCurrency(overview?.totalRevenue || 0)}</div>
              <div style={styles.statChange}>
                <FiTrendingUp size={14} color="#22c55e" />
                <span style={{ color: "#22c55e", fontSize: 12, marginLeft: 4 }}>
                  All time earnings
                </span>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} className="gradient-bg-2">
              <FiEye size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Views</div>
              <div style={styles.statValue}>{formatNumber(overview?.totalViews || 0)}</div>
              <div style={styles.statChange}>
                <span style={{ color: "#888", fontSize: 12 }}>
                  Across {overview?.totalAds || 0} ads
                </span>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} className="gradient-bg-3">
              <FiMousePointer size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Clicks</div>
              <div style={styles.statValue}>{formatNumber(overview?.totalClicks || 0)}</div>
              <div style={styles.statChange}>
                <span style={{ color: "#888", fontSize: 12 }}>
                  {overview?.averageCTR || 0}% CTR
                </span>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon} className="gradient-bg-4">
              <FiActivity size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Active Ads</div>
              <div style={styles.statValue}>{overview?.activeAds || 0}</div>
              <div style={styles.statChange}>
                <span style={{ color: "#888", fontSize: 12 }}>
                  of {overview?.totalAds || 0} total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div style={styles.topPerformersGrid}>
          {/* Top Revenue Ads */}
          <div style={styles.topCard}>
            <div style={styles.topCardHeader}>
              <h3 style={styles.topCardTitle}>
                <FiDollarSign size={20} />
                Top Revenue Ads
              </h3>
            </div>
            <div style={styles.topList}>
              {topPerformers?.topRevenueAds?.slice(0, 5).map((ad, index) => (
                <div key={ad._id} style={styles.topItem}>
                  <div style={styles.topRank}>{index + 1}</div>
                  <div style={styles.topInfo}>
                    <div style={styles.topTitle}>{ad.title}</div>
                    <div style={styles.topStats}>
                      {formatNumber(ad.views)} views • {ad.clicks} clicks
                    </div>
                  </div>
                  <div style={styles.topValue}>
                    {formatCurrency(ad.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Clicked Ads */}
          <div style={styles.topCard}>
            <div style={styles.topCardHeader}>
              <h3 style={styles.topCardTitle}>
                <FiMousePointer size={20} />
                Most Clicked Ads
              </h3>
            </div>
            <div style={styles.topList}>
              {topPerformers?.topClickedAds?.slice(0, 5).map((ad, index) => (
                <div key={ad._id} style={styles.topItem}>
                  <div style={styles.topRank}>{index + 1}</div>
                  <div style={styles.topInfo}>
                    <div style={styles.topTitle}>{ad.title}</div>
                    <div style={styles.topStats}>
                      {formatNumber(ad.views)} views
                    </div>
                  </div>
                  <div style={styles.topValue}>
                    {ad.clicks} clicks
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Viewed Ads */}
          <div style={styles.topCard}>
            <div style={styles.topCardHeader}>
              <h3 style={styles.topCardTitle}>
                <FiEye size={20} />
                Most Viewed Ads
              </h3>
            </div>
            <div style={styles.topList}>
              {topPerformers?.mostViewedAds?.slice(0, 5).map((ad, index) => (
                <div key={ad._id} style={styles.topItem}>
                  <div style={styles.topRank}>{index + 1}</div>
                  <div style={styles.topInfo}>
                    <div style={styles.topTitle}>{ad.title}</div>
                    <div style={styles.topStats}>
                      {ad.clicks} clicks
                    </div>
                  </div>
                  <div style={styles.topValue}>
                    {formatNumber(ad.views)} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Revenue */}
        {categoryData.length > 0 && (
          <div style={styles.categorySection}>
            <h3 style={styles.sectionTitle}>
              <FiPieChart size={20} />
              Revenue by Category
            </h3>
            <div style={styles.categoryGrid}>
              {categoryData.map((cat) => (
                <div key={cat.category} style={styles.categoryCard}>
                  <div style={styles.categoryHeader}>
                    <div style={styles.categoryName}>{cat.category}</div>
                    <div style={styles.categoryRevenue}>
                      {formatCurrency(cat.revenue)}
                    </div>
                  </div>
                  <div style={styles.categoryStats}>
                    <div style={styles.categoryStat}>
                      <span style={styles.categoryStatLabel}>Ads:</span>
                      <span style={styles.categoryStatValue}>{cat.adCount}</span>
                    </div>
                    <div style={styles.categoryStat}>
                      <span style={styles.categoryStatLabel}>Views:</span>
                      <span style={styles.categoryStatValue}>{formatNumber(cat.views)}</span>
                    </div>
                    <div style={styles.categoryStat}>
                      <span style={styles.categoryStatLabel}>Clicks:</span>
                      <span style={styles.categoryStatValue}>{cat.clicks}</span>
                    </div>
                  </div>
                  <div style={styles.categoryProgress}>
                    <div 
                      style={{
                        ...styles.categoryProgressBar,
                        width: `${(cat.revenue / categoryData[0].revenue) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Ad Breakdown Table */}
        <div style={styles.tableSection}>
          <h3 style={styles.sectionTitle}>
            <FiBarChart2 size={20} />
            Detailed Ad Breakdown
          </h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Ad Title</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Target</th>
                  <th style={styles.th}>Views</th>
                  <th style={styles.th}>Clicks</th>
                  <th style={styles.th}>CTR</th>
                  <th style={styles.th}>CPM</th>
                  <th style={styles.th}>CPC</th>
                  <th style={styles.th}>Revenue</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {adBreakdown?.map((ad) => (
                  <tr key={ad._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.adTitleCell}>{ad.title}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: ad.active ? "#22c55e" : "#ef4444"
                      }}>
                        {ad.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.targetCell}>
                        {ad.target === "all" ? "All Videos" : ad.targetValue}
                      </div>
                    </td>
                    <td style={styles.td}>{formatNumber(ad.views)}</td>
                    <td style={styles.td}>{ad.clicks}</td>
                    <td style={styles.td}>
                      <span style={styles.ctrValue}>{ad.ctr}%</span>
                    </td>
                    <td style={styles.td}>{formatCurrency(ad.cpm)}</td>
                    <td style={styles.td}>{formatCurrency(ad.cpc)}</td>
                    <td style={styles.td}>
                      <span style={styles.revenueValue}>
                        {formatCurrency(ad.revenue)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateValue}>{formatDate(ad.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #303030;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 0.8s linear infinite;
        }
        .gradient-bg-1 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .gradient-bg-2 {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .gradient-bg-3 {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .gradient-bg-4 {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#f1f1f1",
    padding: "80px 20px 40px"
  },
  fullWidth: {
    maxWidth: "1600px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "20px"
  },
  mainTitle: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "16px",
    color: "#888",
    margin: 0
  },
  headerActions: {
    display: "flex",
    gap: "12px"
  },
  refreshButton: {
    padding: "12px 20px",
    background: "#272727",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    color: "#f1f1f1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  exportButton: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh"
  },

  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "40px"
  },
  statCard: {
    background: "#1a1a1a",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #2a2a2a",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  statIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "8px",
    fontWeight: "500"
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#f1f1f1",
    marginBottom: "4px"
  },
  statChange: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px"
  },

  // Top Performers
  topPerformersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
    marginBottom: "40px"
  },
  topCard: {
    background: "#1a1a1a",
    borderRadius: "16px",
    border: "1px solid #2a2a2a",
    overflow: "hidden"
  },
  topCardHeader: {
    padding: "20px",
    borderBottom: "1px solid #2a2a2a"
  },
  topCardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#f1f1f1"
  },
  topList: {
    padding: "12px"
  },
  topItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "background 0.2s",
    background: "#222"
  },
  topRank: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0
  },
  topInfo: {
    flex: 1,
    minWidth: 0
  },
  topTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f1f1",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  topStats: {
    fontSize: "12px",
    color: "#888"
  },
  topValue: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#22c55e",
    flexShrink: 0
  },

  // Category Section
  categorySection: {
    marginBottom: "40px"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#f1f1f1"
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  categoryCard: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a"
  },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  categoryName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  categoryRevenue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#22c55e"
  },
  categoryStats: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px"
  },
  categoryStat: {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  categoryStatLabel: {
    fontSize: "11px",
    color: "#888"
  },
  categoryStatValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  categoryProgress: {
    height: "4px",
    background: "#2a2a2a",
    borderRadius: "2px",
    overflow: "hidden"
  },
  categoryProgressBar: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    transition: "width 0.3s"
  },

  // Table Section
  tableSection: {
    background: "#1a1a1a",
    borderRadius: "16px",
    border: "1px solid #2a2a2a",
    overflow: "hidden"
  },
  tableContainer: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeader: {
    background: "#222",
    borderBottom: "1px solid #2a2a2a"
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  tableRow: {
    borderBottom: "1px solid #2a2a2a",
    transition: "background 0.2s"
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#f1f1f1"
  },
  adTitleCell: {
    fontWeight: "600",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase"
  },
  targetCell: {
    fontSize: "13px",
    color: "#888"
  },
  ctrValue: {
    color: "#3b82f6",
    fontWeight: "600"
  },
  revenueValue: {
    color: "#22c55e",
    fontWeight: "700"
  },
  dateValue: {
    fontSize: "13px",
    color: "#888"
  },

  // Common
  card: {
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center"
  },
  button: {
    padding: "12px 24px",
    background: "#667eea",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "20px"
  }
};