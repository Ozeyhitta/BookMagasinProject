"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./manage-sales-reports.module.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

const COLORS = ["#1d4ed8", "#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#f43f5e", "#ef8440"];

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return num.toLocaleString("vi-VN");
};

export default function ViewSalesReports() {
  const [reportType, setReportType] = useState("revenue");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalReturns: 0,
    revenueSeries: [],
    categoryBreakdown: [],
    topBooks: [],
  });

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (startDate) params.append("start", startDate);
    if (endDate) params.append("end", endDate);
    fetch(`http://localhost:8080/api/reports/sales?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setError("Không tải được báo cáo."))
      .finally(() => setLoading(false));
  };

  const stats = useMemo(
    () => [
      { label: "Tổng doanh thu", value: `${formatNumber(data.totalRevenue)} VND` },
      { label: "Tổng đơn hàng", value: formatNumber(data.totalOrders) },
      { label: "Khách hàng (duy nhất)", value: formatNumber(data.totalCustomers) },
      { label: "Hoàn trả / Hủy", value: formatNumber(data.totalReturns) },
    ],
    [data]
  );

  const exportCsv = () => {
    const rows = [
      ["Tổng doanh thu", data.totalRevenue],
      ["Tổng đơn hàng", data.totalOrders],
      ["Khách hàng", data.totalCustomers],
      ["Hoàn trả/Hủy", data.totalReturns],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-report.csv");
    try {
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error("Error triggering download", e);
    } finally {
      try {
        if (link && link.parentNode) link.parentNode.removeChild(link);
      } catch (e) {
        console.error("Error removing download link", e);
      }
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Error revoking object URL", e);
      }
    }
  };

  const renderChart = () => {
    if (reportType === "revenue" || reportType === "orders") {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>{reportType === "revenue" ? "Doanh thu theo thời gian" : "Đơn hàng theo thời gian"}</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            {reportType === "revenue" ? (
              <BarChart data={data.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#1d4ed8" name="Doanh thu (VND)" />
              </BarChart>
            ) : (
              <LineChart data={data.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#f97316" name="Số đơn" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      );
    }

    if (reportType === "category") {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Doanh thu theo danh mục</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoryName, revenue }) => `${categoryName}: ${formatNumber(revenue)}`}
                outerRadius={110}
                dataKey="revenue"
              >
                {data.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${formatNumber(value)} VND`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (reportType === "returns") {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Hoàn trả / Hủy</h3>
          </div>
          <div className={styles.helperText}>Tổng đơn hoàn/hủy trong khoảng thời gian: {formatNumber(data.totalReturns)}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Loại báo cáo</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className={styles.select}>
            <option value="revenue">Doanh thu</option>
            <option value="orders">Đơn hàng</option>
            <option value="category">Danh mục</option>
            <option value="returns">Hoàn trả / Hủy</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Từ ngày</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.dateInput} />
        </div>

        <div className={styles.filterGroup}>
          <label>Đến ngày</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.dateInput} />
        </div>

        <button className={styles.exportBtn} onClick={fetchReport} disabled={loading}>
          <Download size={16} />
          {loading ? "Đang tải..." : "Tải báo cáo"}
        </button>
        <button className={styles.exportBtn} onClick={exportCsv}>
          Xuất CSV
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      {renderChart()}

      <div className={styles.tablesGrid}>
        <div className={styles.tableSection}>
          <h3>Sách bán chạy</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {data.topBooks && data.topBooks.length ? (
                  data.topBooks.map((b, idx) => (
                    <tr key={b.bookId}>
                      <td className={styles.rankCell}>{idx + 1}</td>
                      <td className={styles.nameCell}>{b.title}</td>
                      <td>{formatNumber(b.quantity)}</td>
                      <td>{formatNumber(b.revenue)} VND</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className={styles.emptyText}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.tableSection}>
          <h3>Danh mục theo doanh thu</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {data.categoryBreakdown && data.categoryBreakdown.length ? (
                  data.categoryBreakdown.map((c) => (
                    <tr key={c.categoryName}>
                      <td className={styles.nameCell}>{c.categoryName}</td>
                      <td>{formatNumber(c.revenue)} VND</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className={styles.emptyText}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
