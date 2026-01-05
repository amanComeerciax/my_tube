import React, { useState, useEffect, useContext } from "react";
import api from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    FiDollarSign, FiTrendingUp, FiEye, FiMousePointer,
    FiBarChart2, FiCheckCircle, FiXCircle, FiClock,
    FiDownload, FiRefreshCw, FiAlertCircle, FiCreditCard,
    FiSettings, FiAward
} from "react-icons/fi";

export default function CreatorMonetization() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [status, setStatus] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
        panNumber: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchStatus();
    }, [user]);

    useEffect(() => {
        if (status?.applied && status?.earnings?.isMonetized) {
            fetchDashboard();
        }
    }, [status]);

    const fetchStatus = async () => {
        try {
            const res = await api.get("/api/monetization/status");
            setStatus(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch status:", err);
            setLoading(false);
        }
    };

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/api/monetization/dashboard");
            setDashboard(res.data);
        } catch (err) {
            console.error("Failed to fetch dashboard:", err);
        }
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            const res = await api.post("/api/monetization/apply", {});

            alert(res.data.message);
            fetchStatus();
        } catch (err) {
            alert(err.response?.data?.message || "Application failed");
        } finally {
            setApplying(false);
        }
    };

    const handleSavePaymentInfo = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/monetization/payment-info", paymentInfo);

            alert("✅ Payment information saved successfully");
            setShowPaymentForm(false);
            fetchStatus();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save payment info");
        }
    };

    const handleRequestPayout = async () => {
        if (!window.confirm("Request payout for your pending balance?")) return;

        try {
            const res = await api.post("/api/monetization/request-payout", {});

            alert(res.data.message);
            fetchStatus();
            fetchDashboard();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to request payout");
        }
    };

    const formatCurrency = (amount) => {
        return "₹" + (amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatNumber = (num) => {
        if (!num) return "0";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const getProgressPercentage = (current, required) => {
        return Math.min(100, (current / required) * 100);
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

    if (!status) {
        return (
            <div style={styles.container}>
                <div style={styles.fullCard}>
                    <div style={styles.statusHeader}>
                        <FiAlertCircle size={48} color="#f59e0b" />
                        <h1 style={{ color: "#f59e0b", marginTop: 16 }}>Unable to Load Data</h1>
                        <p style={{ color: "#888", marginTop: 8 }}>
                            Please try refreshing the page.
                        </p>
                        <button onClick={fetchStatus} style={styles.reapplyButton}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!status?.applied) {
        const currentStats = status?.currentStats || {
            totalSubscribers: 0,
            totalWatchHours: 0,
            totalVideos: 0,
            accountAgeDays: 0
        };
        const requiredThresholds = status?.requiredThresholds || {
            SUBSCRIBERS: 1000,
            WATCH_HOURS: 4000,
            VIDEOS_PUBLISHED: 10,
            ACCOUNT_AGE_DAYS: 90
        };

        const requirements = [
            {
                name: "Subscribers",
                current: currentStats.totalSubscribers,
                required: requiredThresholds.SUBSCRIBERS,
                icon: <FiAward size={24} />
            },
            {
                name: "Watch Hours",
                current: currentStats.totalWatchHours,
                required: requiredThresholds.WATCH_HOURS,
                icon: <FiClock size={24} />
            },
            {
                name: "Videos Published",
                current: currentStats.totalVideos,
                required: requiredThresholds.VIDEOS_PUBLISHED,
                icon: <FiBarChart2 size={24} />
            },
            {
                name: "Account Age (days)",
                current: currentStats.accountAgeDays,
                required: requiredThresholds.ACCOUNT_AGE_DAYS,
                icon: <FiCheckCircle size={24} />
            }
        ];

        const allMet = requirements.every(req => req.current >= req.required);

        return (
            <div style={styles.container}>
                <div style={styles.fullCard}>
                    <div style={styles.headerSection}>
                        <h1 style={styles.mainTitle}>💰 Creator Monetization Program</h1>
                        <p style={styles.subtitle}>
                            Earn money from ads shown on your videos
                        </p>
                    </div>

                    <div style={styles.requirementsCard}>
                        <h2 style={styles.sectionTitle}>Eligibility Requirements</h2>
                        <p style={styles.sectionSubtitle}>
                            Meet these requirements to join the monetization program
                        </p>

                        <div style={styles.requirementsGrid}>
                            {requirements.map((req, index) => {
                                const isMet = req.current >= req.required;
                                const progress = getProgressPercentage(req.current, req.required);

                                return (
                                    <div key={index} style={styles.requirementCard}>
                                        <div style={{
                                            ...styles.requirementIcon,
                                            background: isMet
                                                ? "linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
                                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        }}>
                                            {req.icon}
                                        </div>
                                        <div style={styles.requirementInfo}>
                                            <div style={styles.requirementName}>{req.name}</div>
                                            <div style={styles.requirementProgress}>
                                                <span style={styles.currentValue}>
                                                    {formatNumber(req.current)}
                                                </span>
                                                <span style={styles.requirementSeparator}>/</span>
                                                <span style={styles.requiredValue}>
                                                    {formatNumber(req.required)}
                                                </span>
                                            </div>
                                            <div style={styles.progressBar}>
                                                <div
                                                    style={{
                                                        ...styles.progressFill,
                                                        width: `${progress}%`,
                                                        background: isMet ? "#22c55e" : "#667eea"
                                                    }}
                                                />
                                            </div>
                                            {isMet && (
                                                <div style={styles.metBadge}>
                                                    <FiCheckCircle size={14} />
                                                    <span>Met</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={styles.applySection}>
                            {allMet ? (
                                <>
                                    <div style={styles.successMessage}>
                                        <FiCheckCircle size={24} color="#22c55e" />
                                        <span>You meet all requirements!</span>
                                    </div>
                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        style={styles.applyButton}
                                    >
                                        {applying ? "Applying..." : "Apply for Monetization"}
                                    </button>
                                </>
                            ) : (
                                <div style={styles.infoMessage}>
                                    <FiAlertCircle size={20} color="#f59e0b" />
                                    <span>Keep growing! You'll be eligible soon.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!status?.earnings?.isMonetized) {
        return (
            <div style={styles.container}>
                <div style={styles.fullCard}>
                    <div style={styles.statusHeader}>
                        {status?.earnings?.monetizationStatus === "pending" ? (
                            <>
                                <FiClock size={48} color="#f59e0b" />
                                <h1 style={{ color: "#f59e0b", marginTop: 16 }}>Application Pending</h1>
                                <p style={{ color: "#888", marginTop: 8 }}>
                                    Your monetization application is under review. We'll notify you soon!
                                </p>
                            </>
                        ) : (
                            <>
                                <FiXCircle size={48} color="#ef4444" />
                                <h1 style={{ color: "#ef4444", marginTop: 16 }}>Application Not Approved</h1>
                                <p style={{ color: "#888", marginTop: 8 }}>
                                    Your application wasn't approved this time. Keep creating great content!
                                </p>
                                <button onClick={handleApply} style={styles.reapplyButton}>
                                    Reapply
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const earnings = status?.earnings || {
        earnings: {
            pendingBalance: 0,
            totalEarnings: 0,
            thisMonth: 0,
            fromCPM: 0,
            fromCPC: 0,
            totalPaidOut: 0
        },
        adPerformance: {
            averageCTR: 0
        },
        minPayoutThreshold: 1000,
        eligibleForPayout: false
    };

    return (
        <div style={styles.container}>
            <div style={styles.fullWidth}>
                <div style={styles.dashboardHeader}>
                    <div>
                        <h1 style={styles.mainTitle}>💰 Monetization Dashboard</h1>
                        <p style={styles.subtitle}>Track your earnings and performance</p>
                    </div>
                    <div style={styles.headerActions}>
                        <button onClick={fetchDashboard} style={styles.refreshButton}>
                            <FiRefreshCw size={18} />
                            <span>Refresh</span>
                        </button>
                        <button onClick={() => setShowPaymentForm(true)} style={styles.settingsButton}>
                            <FiSettings size={18} />
                            <span>Payment Settings</span>
                        </button>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                            <FiDollarSign size={28} />
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>Pending Balance</div>
                            <div style={styles.statValue}>{formatCurrency(earnings.earnings.pendingBalance)}</div>
                            <div style={styles.statChange}>
                                {earnings.eligibleForPayout ? (
                                    <span style={{ color: "#22c55e", fontSize: 12 }}>
                                        ✓ Eligible for payout
                                    </span>
                                ) : (
                                    <span style={{ color: "#888", fontSize: 12 }}>
                                        Min: {formatCurrency(earnings.minPayoutThreshold)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                            <FiTrendingUp size={28} />
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>This Month</div>
                            <div style={styles.statValue}>
                                {formatCurrency(dashboard?.thisMonth?.totalRevenue || 0)}
                            </div>
                            <div style={styles.statChange}>
                                <span style={{ color: "#888", fontSize: 12 }}>
                                    {dashboard?.thisMonth?.totalViews || 0} ad views
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                            <FiBarChart2 size={28} />
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>Total Earned</div>
                            <div style={styles.statValue}>{formatCurrency(earnings.earnings.totalEarnings)}</div>
                            <div style={styles.statChange}>
                                <span style={{ color: "#888", fontSize: 12 }}>
                                    All time earnings
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
                            <FiMousePointer size={28} />
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statLabel}>Ad Performance</div>
                            <div style={styles.statValue}>{earnings.adPerformance.averageCTR}%</div>
                            <div style={styles.statChange}>
                                <span style={{ color: "#888", fontSize: 12 }}>
                                    Average CTR
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {earnings.eligibleForPayout && (
                    <div style={styles.payoutCard}>
                        <div style={styles.payoutContent}>
                            <FiCreditCard size={32} color="#22c55e" />
                            <div>
                                <h3 style={styles.payoutTitle}>Ready for Payout!</h3>
                                <p style={styles.payoutText}>
                                    You have {formatCurrency(earnings.earnings.pendingBalance)} available to withdraw
                                </p>
                            </div>
                        </div>
                        <button onClick={handleRequestPayout} style={styles.payoutButton}>
                            Request Payout
                        </button>
                    </div>
                )}

                {dashboard?.topVideos && dashboard.topVideos.length > 0 && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <FiTrendingUp size={20} />
                            Top Earning Videos
                        </h2>
                        <div style={styles.videosGrid}>
                            {dashboard.topVideos.slice(0, 5).map((item) => (
                                <div key={item._id._id} style={styles.videoCard}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/uploads/${item._id.thumbnail}`}
                                        alt={item._id.title}
                                        style={styles.videoThumb}
                                    />
                                    <div style={styles.videoInfo}>
                                        <h4 style={styles.videoTitle}>{item._id.title}</h4>
                                        <div style={styles.videoStats}>
                                            <span>{formatNumber(item._id.views)} views</span>
                                            <span>•</span>
                                            <span>{item.adViews} ad views</span>
                                        </div>
                                        <div style={styles.videoRevenue}>
                                            {formatCurrency(item.totalRevenue)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={styles.breakdownSection}>
                    <h2 style={styles.sectionTitle}>Revenue Breakdown</h2>
                    <div style={styles.breakdownGrid}>
                        <div style={styles.breakdownCard}>
                            <div style={styles.breakdownLabel}>From Ad Views (CPM)</div>
                            <div style={styles.breakdownValue}>
                                {formatCurrency(earnings.earnings.fromCPM)}
                            </div>
                            <div style={styles.breakdownPercent}>
                                {((earnings.earnings.fromCPM / earnings.earnings.totalEarnings) * 100).toFixed(1)}% of total
                            </div>
                        </div>
                        <div style={styles.breakdownCard}>
                            <div style={styles.breakdownLabel}>From Ad Clicks (CPC)</div>
                            <div style={styles.breakdownValue}>
                                {formatCurrency(earnings.earnings.fromCPC)}
                            </div>
                            <div style={styles.breakdownPercent}>
                                {((earnings.earnings.fromCPC / earnings.earnings.totalEarnings) * 100).toFixed(1)}% of total
                            </div>
                        </div>
                        <div style={styles.breakdownCard}>
                            <div style={styles.breakdownLabel}>Total Paid Out</div>
                            <div style={styles.breakdownValue}>
                                {formatCurrency(earnings.earnings.totalPaidOut)}
                            </div>
                            <div style={styles.breakdownPercent}>
                                {earnings.paymentHistory?.length || 0} payments
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPaymentForm && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2>Payment Information</h2>
                            <button onClick={() => setShowPaymentForm(false)} style={styles.closeButton}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSavePaymentInfo} style={styles.paymentForm}>
                            <input
                                type="text"
                                placeholder="Account Holder Name *"
                                value={paymentInfo.accountHolderName}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, accountHolderName: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Bank Name *"
                                value={paymentInfo.bankName}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Account Number *"
                                value={paymentInfo.accountNumber}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="IFSC Code *"
                                value={paymentInfo.ifscCode}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, ifscCode: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="UPI ID (optional)"
                                value={paymentInfo.upiId}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="PAN Number * (Required in India)"
                                value={paymentInfo.panNumber}
                                onChange={(e) => setPaymentInfo({ ...paymentInfo, panNumber: e.target.value })}
                                required
                                maxLength={10}
                                style={styles.input}
                            />
                            <button type="submit" style={styles.submitButton}>
                                Save Payment Info
                            </button>
                        </form>
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
        maxWidth: "1600px",
        margin: "0 auto"
    },
    fullCard: {
        background: "#1a1a1a",
        borderRadius: "16px",
        maxWidth: "1200px",
        margin: "0 auto",
        overflow: "hidden"
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh"
    },
    headerSection: {
        padding: "40px",
        textAlign: "center",
        borderBottom: "1px solid #2a2a2a"
    },
    mainTitle: {
        fontSize: "36px",
        fontWeight: "700",
        margin: "0 0 12px 0",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    subtitle: {
        fontSize: "16px",
        color: "#888",
        margin: 0
    },
    requirementsCard: {
        padding: "40px"
    },
    sectionTitle: {
        fontSize: "24px",
        fontWeight: "600",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    sectionSubtitle: {
        fontSize: "14px",
        color: "#888",
        marginBottom: "32px"
    },
    requirementsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
    },
    requirementCard: {
        background: "#222",
        padding: "24px",
        borderRadius: "12px",
        display: "flex",
        gap: "16px"
    },
    requirementIcon: {
        width: "56px",
        height: "56px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        flexShrink: 0
    },
    requirementInfo: {
        flex: 1
    },
    requirementName: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#f1f1f1",
        marginBottom: "8px"
    },
    requirementProgress: {
        display: "flex",
        alignItems: "baseline",
        gap: "4px",
        marginBottom: "8px"
    },
    currentValue: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#f1f1f1"
    },
    requirementSeparator: {
        fontSize: "16px",
        color: "#666"
    },
    requiredValue: {
        fontSize: "16px",
        color: "#888"
    },
    progressBar: {
        height: "6px",
        background: "#2a2a2a",
        borderRadius: "3px",
        overflow: "hidden",
        marginBottom: "8px"
    },
    progressFill: {
        height: "100%",
        transition: "width 0.3s"
    },
    metBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 10px",
        background: "rgba(34, 197, 94, 0.2)",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#22c55e"
    },
    applySection: {
        textAlign: "center"
    },
    successMessage: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "20px",
        fontSize: "18px",
        fontWeight: "600",
        color: "#22c55e"
    },
    applyButton: {
        padding: "16px 40px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "12px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer"
    },
    infoMessage: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontSize: "16px",
        color: "#f59e0b"
    },
    statusHeader: {
        padding: "60px 40px",
        textAlign: "center"
    },
    reapplyButton: {
        marginTop: "24px",
        padding: "12px 32px",
        background: "#667eea",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    },
    dashboardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "20px"
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
        fontWeight: "500"
    },
    settingsButton: {
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
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
    },
    statCard: {
        background: "#1a1a1a",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #2a2a2a",
        display: "flex",
        gap: "16px"
    },
    statIcon: {
        width: "64px",
        height: "64px",
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
        alignItems: "center"
    },
    payoutCard: {
        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
        border: "1px solid rgba(34, 197, 94, 0.3)",
        padding: "24px",
        borderRadius: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "16px"
    },
    payoutContent: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    payoutTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#22c55e",
        marginBottom: "4px"
    },
    payoutText: {
        fontSize: "14px",
        color: "#888",
        margin: 0
    },
    payoutButton: {
        padding: "14px 32px",
        background: "#22c55e",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer"
    },
    section: {
        marginBottom: "40px"
    },
    videosGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
    },
    videoCard: {
        background: "#1a1a1a",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #2a2a2a"
    },
    videoThumb: {
        width: "100%",
        height: "180px",
        objectFit: "cover"
    },
    videoInfo: {
        padding: "16px"
    },
    videoTitle: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#f1f1f1",
        marginBottom: "8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical"
    },
    videoStats: {
        display: "flex",
        gap: "8px",
        fontSize: "12px",
        color: "#888",
        marginBottom: "8px"
    },
    videoRevenue: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#22c55e"
    },
    breakdownSection: {
        marginTop: "40px"
    },
    breakdownGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
    },
    breakdownCard: {
        background: "#1a1a1a",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #2a2a2a"
    },
    breakdownLabel: {
        fontSize: "13px",
        color: "#888",
        marginBottom: "12px"
    },
    breakdownValue: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#f1f1f1",
        marginBottom: "8px"
    },
    breakdownPercent: {
        fontSize: "12px",
        color: "#667eea"
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
        maxWidth: "500px",
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
    paymentForm: {
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    input: {
        padding: "12px 16px",
        background: "#272727",
        border: "1px solid #3a3a3a",
        borderRadius: "8px",
        color: "#f1f1f1",
        fontSize: "14px",
        outline: "none"
    },
    submitButton: {
        padding: "14px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "8px"
    }
};