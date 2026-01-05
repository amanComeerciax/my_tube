import React, { useState, useEffect, useContext } from "react";
import api from "../config/api";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUsers, FiDollarSign, FiCheckCircle, FiXCircle, FiClock,
  FiTrendingUp, FiFilter, FiSearch, FiDownload, FiEye
} from "react-icons/fi";

export default function AdminMonetizationPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreator, setSelectedCreator] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // TODO: Add admin check
    fetchCreators();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [creators, filter, searchTerm]);

  /* ================= FETCH ALL CREATORS ================= */
  const fetchCreators = async () => {
    try {
      const res = await api.get("/api/monetization/admin/creators", {
        
      });
      setCreators(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch creators:", err);
      setLoading(false);
    }
  };

  /* ================= APPLY FILTERS ================= */
  const applyFilters = () => {
    let filtered = [...creators];

    // Status filter
    if (filter !== "all") {
      filtered = filtered.filter(c => c.monetizationStatus === filter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.creator?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCreators(filtered);
  };

  /* ================= APPROVE/REJECT APPLICATION ================= */
  const handleReview = async (creatorId, status) => {
    if (!window.confirm(`${status === "approved" ? "Approve" : "Reject"} this application?`)) {
      return;
    }

    try {
      await api.post(
        `/api/monetization/admin/review/${creatorId}`,
        { status },
        {  }
      );
      
      alert(`✅ Application ${status}`);
      fetchCreators();
      setSelectedCreator(null);
    } catch (err) {
      alert("Failed to review application");
    }
  };

  /* ================= PROCESS PAYOUT ================= */
//   const handleProcessPayout = async (earningsId, paymentId) => {
//     const transactionId = prompt("Enter transaction ID:");
//     if (!transactionId) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.post(
//         `/api/monetization/admin/process-payout/${earningsId}/${paymentId}`,
//         { transactionId },
//         {  }
//       );
      
//       alert("✅ Payout processed successfully");
//       fetchCreators();
//     } catch (err) {
//       alert("Failed to process payout");
//     }
//   };


const handleProcessPayout = async (earningsId, paymentId) => {
    if (!window.confirm("Send payout via Razorpay?")) return;
  
    try {
  
      await api.post(
        `/api/monetization/admin/process-payout/${earningsId}/${paymentId}`,
        {}, // ❌ no transactionId
        {  }
      );
  
      alert("✅ Payout sent via Razorpay");
      fetchCreators();
      setSelectedCreator(null);
    } catch (err) {
      alert(err.response?.data?.message || "Razorpay payout failed");
    }
  };
  
  /* ================= HELPERS ================= */
  const formatCurrency = (amount) => {
    return "₹" + (amount || 0).toLocaleString("en-IN", { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "#22c55e";
      case "rejected": return "#ef4444";
      case "pending": return "#f59e0b";
      case "suspended": return "#6b7280";
      default: return "#888";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return <FiCheckCircle />;
      case "rejected": return <FiXCircle />;
      case "pending": return <FiClock />;
      default: return <FiClock />;
    }
  };

  /* ================= STATS CALCULATION ================= */
  const stats = {
    total: creators.length,
    approved: creators.filter(c => c.monetizationStatus === "approved").length,
    pending: creators.filter(c => c.monetizationStatus === "pending").length,
    rejected: creators.filter(c => c.monetizationStatus === "rejected").length,
    totalRevenue: creators.reduce((sum, c) => sum + (c.earnings?.totalEarnings || 0), 0),
    pendingPayouts: creators.reduce((sum, c) => sum + (c.earnings?.pendingBalance || 0), 0)
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div className="spinner"></div>
          <p style={{ marginTop: 16, color: "#888" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.fullWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.mainTitle}>👥 Creator Monetization Management</h1>
            <p style={styles.subtitle}>Manage creator applications and payouts</p>
          </div>
          <button onClick={fetchCreators} style={styles.refreshButton}>
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
              <FiUsers size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Creators</div>
              <div style={styles.statValue}>{stats.total}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)"}}>
              <FiCheckCircle size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Approved</div>
              <div style={styles.statValue}>{stats.approved}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"}}>
              <FiClock size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Pending Review</div>
              <div style={styles.statValue}>{stats.pending}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"}}>
              <FiDollarSign size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Revenue</div>
              <div style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"}}>
              <FiTrendingUp size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Pending Payouts</div>
              <div style={styles.statValue}>{formatCurrency(stats.pendingPayouts)}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"}}>
              <FiXCircle size={24} />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Rejected</div>
              <div style={styles.statValue}>{stats.rejected}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersSection}>
          <div style={styles.filterButtons}>
            {["all", "pending", "approved", "rejected"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.filterButton,
                  ...(filter === f ? styles.activeFilterButton : {})
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div style={styles.searchBox}>
            <FiSearch size={18} color="#888" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Creators Table */}
        <div style={styles.tableSection}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Creator</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Applied</th>
                  <th style={styles.th}>Subscribers</th>
                  <th style={styles.th}>Watch Hours</th>
                  <th style={styles.th}>Total Earned</th>
                  <th style={styles.th}>Pending</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.map((creator) => (
                  <tr key={creator._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.creatorCell}>
                        <div style={styles.creatorAvatar}>
                          {creator.creator?.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div>
                          <div style={styles.creatorName}>{creator.creator?.name || "Unknown"}</div>
                          <div style={styles.creatorEmail}>{creator.creator?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: `${getStatusColor(creator.monetizationStatus)}20`,
                        color: getStatusColor(creator.monetizationStatus),
                        border: `1px solid ${getStatusColor(creator.monetizationStatus)}`
                      }}>
                        {getStatusIcon(creator.monetizationStatus)}
                        <span>{creator.monetizationStatus}</span>
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(creator.appliedAt)}</td>
                    <td style={styles.td}>{creator.currentStats?.totalSubscribers || 0}</td>
                    <td style={styles.td}>{creator.currentStats?.totalWatchHours || 0}</td>
                    <td style={styles.td}>
                      <span style={styles.revenueValue}>
                        {formatCurrency(creator.earnings?.totalEarnings || 0)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.pendingValue}>
                        {formatCurrency(creator.earnings?.pendingBalance || 0)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => setSelectedCreator(creator)}
                          style={styles.viewButton}
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        {creator.monetizationStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleReview(creator._id, "approved")}
                              style={{...styles.actionButton, background: "#22c55e"}}
                              title="Approve"
                            >
                              <FiCheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReview(creator._id, "rejected")}
                              style={{...styles.actionButton, background: "#ef4444"}}
                              title="Reject"
                            >
                              <FiXCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCreators.length === 0 && (
          <div style={styles.emptyState}>
            <FiUsers size={48} color="#555" />
            <p style={{ color: "#888", marginTop: 16 }}>No creators found</p>
          </div>
        )}
      </div>

      {/* Creator Detail Modal */}
      {selectedCreator && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>Creator Details</h2>
              <button onClick={() => setSelectedCreator(null)} style={styles.closeButton}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {/* Creator Info */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailTitle}>Creator Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Name:</span>
                    <span style={styles.detailValue}>{selectedCreator.creator?.name}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Email:</span>
                    <span style={styles.detailValue}>{selectedCreator.creator?.email}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Status:</span>
                    <span style={{
                      ...styles.statusBadge,
                      background: `${getStatusColor(selectedCreator.monetizationStatus)}20`,
                      color: getStatusColor(selectedCreator.monetizationStatus),
                      border: `1px solid ${getStatusColor(selectedCreator.monetizationStatus)}`
                    }}>
                      {selectedCreator.monetizationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eligibility */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailTitle}>Eligibility Status</h3>
                <div style={styles.eligibilityGrid}>
                  {Object.entries(selectedCreator.eligibilityMet).map(([key, met]) => (
                    <div key={key} style={styles.eligibilityItem}>
                      {met ? (
                        <FiCheckCircle size={20} color="#22c55e" />
                      ) : (
                        <FiXCircle size={20} color="#ef4444" />
                      )}
                      <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailTitle}>Earnings Summary</h3>
                <div style={styles.earningsGrid}>
                  <div style={styles.earningCard}>
                    <span style={styles.earningLabel}>Total Earnings</span>
                    <span style={styles.earningValue}>
                      {formatCurrency(selectedCreator.earnings?.totalEarnings || 0)}
                    </span>
                  </div>
                  <div style={styles.earningCard}>
                    <span style={styles.earningLabel}>Pending Balance</span>
                    <span style={styles.earningValue}>
                      {formatCurrency(selectedCreator.earnings?.pendingBalance || 0)}
                    </span>
                  </div>
                  <div style={styles.earningCard}>
                    <span style={styles.earningLabel}>Total Paid Out</span>
                    <span style={styles.earningValue}>
                      {formatCurrency(selectedCreator.earnings?.totalPaidOut || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedCreator.paymentInfo?.accountNumber && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailTitle}>Payment Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Account Holder:</span>
                      <span style={styles.detailValue}>{selectedCreator.paymentInfo.accountHolderName}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Bank:</span>
                      <span style={styles.detailValue}>{selectedCreator.paymentInfo.bankName}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Account:</span>
                      <span style={styles.detailValue}>****{selectedCreator.paymentInfo.accountNumber?.slice(-4)}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>IFSC:</span>
                      <span style={styles.detailValue}>{selectedCreator.paymentInfo.ifscCode}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>PAN:</span>
                      <span style={styles.detailValue}>{selectedCreator.paymentInfo.panNumber}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Verified:</span>
                      <span style={styles.detailValue}>
                        {selectedCreator.paymentInfo.verified ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Payouts */}
              {selectedCreator.paymentHistory?.filter(p => p.status === "pending").length > 0 && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailTitle}>Pending Payouts</h3>
                  {selectedCreator.paymentHistory
                    .filter(p => p.status === "pending")
                    .map(payment => (
                      <div key={payment._id} style={styles.paymentRequest}>
                        <div>
                          <div style={styles.paymentAmount}>
                            {formatCurrency(payment.amount)}
                          </div>
                          <div style={styles.paymentDate}>
                            Requested: {formatDate(payment.createdAt)}
                          </div>
                        </div>
                        {/* <button
                          onClick={() => handleProcessPayout(selectedCreator._id, payment._id)}
                          style={styles.processButton}
                        >
                          Process Payout
                        </button> */}

<button
  onClick={() => handleProcessPayout(selectedCreator._id, payment._id)}
  style={{
    ...styles.processButton,
    background: "#2563eb"
  }}
>
  Pay via Razorpay
</button>

                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
    maxWidth: "1800px",
    margin: "0 auto"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh"
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
  refreshButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "32px"
  },
  statCard: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    display: "flex",
    gap: "16px",
    alignItems: "center"
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
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
    fontSize: "12px",
    color: "#888",
    marginBottom: "6px",
    fontWeight: "500"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f1f1f1"
  },
  filtersSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "20px",
    flexWrap: "wrap"
  },
  filterButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  filterButton: {
    padding: "10px 20px",
    background: "#222",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    color: "#888",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  activeFilterButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "1px solid transparent"
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#1a1a1a",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #2a2a2a",
    minWidth: "300px"
  },
  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#f1f1f1",
    fontSize: "14px",
    outline: "none"
  },
  tableSection: {
    background: "#1a1a1a",
    borderRadius: "12px",
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
    fontSize: "12px",
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
  creatorCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  creatorAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    flexShrink: 0
  },
  creatorName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f1f1"
  },
  creatorEmail: {
    fontSize: "12px",
    color: "#888"
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize"
  },
  revenueValue: {
    color: "#22c55e",
    fontWeight: "700"
  },
  pendingValue: {
    color: "#f59e0b",
    fontWeight: "700"
  },
  actionButtons: {
    display: "flex",
    gap: "8px"
  },
  viewButton: {
    padding: "8px",
    background: "#667eea",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  actionButton: {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center"
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px"
  },
  modalContent: {
    background: "#1a1a1a",
    borderRadius: "16px",
    maxWidth: "800px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto"
  },
  modalHeader: {
    padding: "24px",
    borderBottom: "1px solid #2a2a2a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "32px",
    cursor: "pointer",
    padding: 0,
    width: "32px",
    height: "32px"
  },
  modalBody: {
    padding: "24px"
  },
  detailSection: {
    marginBottom: "32px"
  },
  detailTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#f1f1f1"
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  detailLabel: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "500"
  },
  detailValue: {
    fontSize: "14px",
    color: "#f1f1f1",
    fontWeight: "600"
  },
  eligibilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px"
  },
  eligibilityItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "#222",
    borderRadius: "8px",
    fontSize: "14px"
  },
  earningsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px"
  },
  earningCard: {
    background: "#222",
    padding: "16px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  earningLabel: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "500"
  },
  earningValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#22c55e"
  },
  paymentRequest: {
    background: "#222",
    padding: "16px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  paymentAmount: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f59e0b",
    marginBottom: "4px"
  },
  paymentDate: {
    fontSize: "12px",
    color: "#888"
  },
  processButton: {
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  }
};