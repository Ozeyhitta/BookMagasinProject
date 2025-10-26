"use client"
import { useState } from "react"
import styles from "./manage-sales-reports.module.css"
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
} from "recharts"
import { Download } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 221 },
  { month: "Mar", revenue: 2000, orders: 229 },
  { month: "Apr", revenue: 2780, orders: 200 },
  { month: "May", revenue: 1890, orders: 229 },
  { month: "Jun", revenue: 2390, orders: 200 },
]

const categoryData = [
  { name: "Tiểu thuyết", value: 35 },
  { name: "Khoa học", value: 25 },
  { name: "Lịch sử", value: 20 },
  { name: "Tự giúp", value: 20 },
]

const topBooksData = [
  { rank: 1, title: "Sách bán chạy 1", sales: 450, revenue: 9000 },
  { rank: 2, title: "Sách bán chạy 2", sales: 380, revenue: 7600 },
  { rank: 3, title: "Sách bán chạy 3", sales: 320, revenue: 6400 },
  { rank: 4, title: "Sách bán chạy 4", sales: 290, revenue: 5800 },
  { rank: 5, title: "Sách bán chạy 5", sales: 250, revenue: 5000 },
]

const returnReasonData = [
  { reason: "Sản phẩm lỗi", count: 45, percentage: 35 },
  { reason: "Không đúng mô tả", count: 38, percentage: 29 },
  { reason: "Giao hàng chậm", count: 32, percentage: 25 },
  { reason: "Khác", count: 15, percentage: 11 },
]

const COLORS = ["#1976d2", "#f57c00", "#388e3c", "#d32f2f"]

export default function ViewSalesReports() {
  const [reportType, setReportType] = useState("revenue")
  const [startDate, setStartDate] = useState("2025-01-20")
  const [endDate, setEndDate] = useState("2025-02-09")

  const stats = {
    revenue: { value: "45,230,000 VND", change: "+12.5%" },
    orders: { value: "1,319", change: "+8.2%" },
    customers: { value: "245", change: "+5.3%" },
    returns: { value: "130", change: "-2.1%" },
  }

  const renderChart = () => {
    switch (reportType) {
      case "revenue":
        return (
          <div className={styles.chartContainer}>
            <h3>Doanh thu theo thời gian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#1976d2" name="Doanh thu (VND)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      case "orders":
        return (
          <div className={styles.chartContainer}>
            <h3>Số lượng đơn hàng theo thời gian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#f57c00" name="Số đơn hàng" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      case "category":
        return (
          <div className={styles.chartContainer}>
            <h3>Doanh thu theo danh mục</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      case "returns":
        return (
          <div className={styles.chartContainer}>
            <h3>Lý do hoàn trả/hủy đơn</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={returnReasonData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {returnReasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Loại báo cáo:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className={styles.select}>
            <option value="revenue">Doanh thu</option>
            <option value="orders">Đơn hàng</option>
            <option value="category">Danh mục</option>
            <option value="returns">Hoàn trả/Hủy</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <button className={styles.exportBtn}>
          <Download size={16} />
          Xuất báo cáo
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tổng doanh thu</div>
          <div className={styles.statValue}>{stats.revenue.value}</div>
          <div className={styles.statChange}>{stats.revenue.change}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tổng đơn hàng</div>
          <div className={styles.statValue}>{stats.orders.value}</div>
          <div className={styles.statChange}>{stats.orders.change}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Khách hàng mới</div>
          <div className={styles.statValue}>{stats.customers.value}</div>
          <div className={styles.statChange}>{stats.customers.change}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Hoàn trả/Hủy</div>
          <div className={styles.statValue}>{stats.returns.value}</div>
          <div className={styles.statChange}>{stats.returns.change}</div>
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Tables */}
      <div className={styles.tablesGrid}>
        {/* Top Books */}
        <div className={styles.tableSection}>
          <h3>Sách bán chạy nhất</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Xếp hạng</th>
                  <th>Tên sách</th>
                  <th>Số lượng bán</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topBooksData.map((book) => (
                  <tr key={book.rank}>
                    <td className={styles.rankCell}>{book.rank}</td>
                    <td className={styles.nameCell}>{book.title}</td>
                    <td>{book.sales}</td>
                    <td>{book.revenue.toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return Reasons */}
        <div className={styles.tableSection}>
          <h3>Lý do hoàn trả/hủy</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Lý do</th>
                  <th>Số lượng</th>
                  <th>Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {returnReasonData.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.nameCell}>{item.reason}</td>
                    <td>{item.count}</td>
                    <td>
                      <span className={styles.percentageBadge}>{item.percentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
