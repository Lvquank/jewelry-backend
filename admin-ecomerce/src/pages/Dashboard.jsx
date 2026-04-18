import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getDashboard, getRevenueChart, getTopProducts, getRecentOrders } from '../api';

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

const statusMap = {
  pending: { label: 'Chờ xử lý', cls: 'badge-yellow' },
  confirmed: { label: 'Đã xác nhận', cls: 'badge-cyan' },
  shipping: { label: 'Đang giao', cls: 'badge-purple' },
  delivered: { label: 'Đã giao', cls: 'badge-green' },
  cancelled: { label: 'Đã hủy', cls: 'badge-red' },
};

const PIE_COLORS = ['#C9A84C', '#9B7C2B', '#E8C96A', '#D4B45E', '#a8924a'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    Promise.all([
      getDashboard(),
      getRevenueChart(period),
      getTopProducts(),
      getRecentOrders(),
    ]).then(([dash, rev, top, recent]) => {
      setStats(dash.data || dash);
      const rawRevenue = rev.data || rev.chartData || [];
      setRevenue(Array.isArray(rawRevenue) ? rawRevenue : []);
      const topArr = top.data || top.products || top || [];
      setTopProducts(Array.isArray(topArr) ? topArr.slice(0, 5) : []);
      const orders = recent.data || recent.orders || recent || [];
      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 8) : []);
      // Build pie data from dashboard
      const s = dash.data || dash;
      if (s?.orderStats) {
        setOrderStats(Object.entries(s.orderStats).map(([k, v]) => ({
          name: statusMap[k]?.label || k, value: v
        })));
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
    getRevenueChart(period).then(rev => {
      const rawRevenue = rev.data || rev.chartData || [];
      setRevenue(Array.isArray(rawRevenue) ? rawRevenue : []);
    }).catch(console.error);
  }, [period]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span>Đang tải dữ liệu...</span>
    </div>
  );

  const statCards = [
    { label: 'Tổng doanh thu', value: fmt(stats?.totalRevenue), icon: '💰', color: '#C9A84C', change: '+12.5%', positive: true },
    { label: 'Đơn hàng', value: stats?.totalOrders || 0, icon: '📦', color: '#4A90A4', change: '+8.2%', positive: true },
    { label: 'Sản phẩm', value: stats?.totalProducts || 0, icon: '💍', color: '#7B68C8', change: '+3.1%', positive: true },
    { label: 'Người dùng', value: stats?.totalUsers || 0, icon: '👥', color: '#4CAF82', change: '+5.7%', positive: true },
  ];

  return (
    <div className="page-enter">
      {/* Stats */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-gradient': `linear-gradient(90deg, ${s.color}, ${s.color})` }}>
            <div className="stat-card-info">
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className={`stat-card-change ${s.positive ? 'positive' : 'negative'}`}>
                {s.positive ? '▲' : '▼'} {s.change} so với tháng trước
              </div>
            </div>
            <div className="stat-card-icon" style={{ background: s.color }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div className="chart-title">📈 Doanh thu</div>
              <div className="chart-subtitle">Biểu đồ doanh thu theo thời gian</div>
            </div>
            <select
              className="select-control"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="year">12 tháng qua</option>
            </select>
          </div>
          {revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.12)" />
                <XAxis dataKey="label" tick={{ fill: '#a8924a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a8924a', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ background: '#fffdf8', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, color: '#1a1508' }}
                  formatter={v => [fmt(v), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: 220 }}>
              <div className="empty-state-text">Không có dữ liệu doanh thu</div>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-title">🥧 Trạng thái đơn hàng</div>
          <div className="chart-subtitle" style={{ marginBottom: 20 }}>Phân bổ theo trạng thái</div>
          {orderStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={orderStats} cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {orderStats.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fffdf8', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, color: '#1a1508' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#a8924a' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: 220 }}>
              <div className="empty-state-text">Không có dữ liệu</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="recent-orders-grid">
        {/* Recent Orders */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">🕐 Đơn hàng gần đây</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Không có đơn hàng</td></tr>
              ) : recentOrders.map(o => (
                <tr key={o._id}>
                  <td className="td-main" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    #{o._id?.slice(-6)?.toUpperCase()}
                  </td>
                  <td>{o.shippingAddress?.fullName || o.user?.name || '—'}</td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{fmt(o.totalPrice)}</td>
                  <td>
                    <span className={`badge ${statusMap[o.status]?.cls || 'badge-gray'}`}>
                      {statusMap[o.status]?.label || o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">🔥 Sản phẩm bán chạy</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Đã bán</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Không có dữ liệu</td></tr>
              ) : topProducts.map((p, i) => (
                <tr key={p._id}>
                  <td>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      background: i < 3 ? '#C9A84C' : 'rgba(201,168,76,0.1)',
                      color: i < 3 ? '#fff' : 'var(--text-muted)',
                    }}>{i + 1}</span>
                  </td>
                  <td>
                    <div className="product-cell">
                      {p.image && <img src={p.image} alt={p.name} className="product-thumb" style={{ width: 36, height: 36 }} />}
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{p.selled || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
