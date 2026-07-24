import { useState, useEffect } from 'react'
import { ShoppingBag, IndianRupee, Users, Package, TrendingUp, Sparkles, Send, BarChart2, Globe, Star, RefreshCw } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'

const STATUS_COLORS = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#6c63ff', delivered: '#22c55e', cancelled: '#ef4444' }
const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [insights, setInsights] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/dashboard/analytics')
      setAnalytics(res.data.analytics)
    } catch (err) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const generateInsights = async () => {
    setLoadingAI(true)
    try {
      const res = await api.post('/ai/analyze')
      setInsights(res.data.insights)
      toast.success('AI insights generated!')
    } catch (err) {
      toast.error('AI analysis failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoadingAI(false)
    }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  const monthlyData = analytics?.monthlyRevenue?.map(m => ({
    name: MONTH_NAMES[m._id.month], revenue: Math.round(m.revenue), orders: m.orders
  })) || []

  const statusData = analytics?.ordersByStatus?.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1), value: s.count, color: STATUS_COLORS[s._id] || '#6c63ff'
  })) || []

  const maxGeo = Math.max(...(analytics?.ordersByGeo || []).map(g => g.count), 1)

  return (
    <div>
      <div className="page-header-row page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Monitor your pyrotechnics empire here.</p>
        </div>
        <button className="btn btn-primary" onClick={generateInsights} disabled={loadingAI}>
          <Sparkles size={16} />
          {loadingAI ? 'Analyzing...' : 'Generate AI Insights'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-purple"><ShoppingBag size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{analytics?.totalOrders || 0}</div>
            <div className="stat-change">↑ All time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-green"><IndianRupee size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">{formatPrice(analytics?.totalRevenue || 0)}</div>
            <div className="stat-change">↑ All time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-blue"><Users size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Customers</div>
            <div className="stat-value">{analytics?.totalUsers || 0}</div>
            <div className="stat-change">↑ Registered</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-orange"><Package size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Active Products</div>
            <div className="stat-value">{analytics?.totalProducts || 0}</div>
            <div className="stat-change">In catalog</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {insights && (
        <div className="ai-panel" style={{ marginBottom: 24 }}>
          <div className="ai-panel-header">
            <div className="ai-panel-title">
              <Sparkles size={18} color="var(--accent-light)" />
              Claude AI Business Insights
              <span className="ai-badge">LIVE</span>
            </div>
            <button className="btn btn-sm btn-outline" onClick={generateInsights} disabled={loadingAI}>
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          {insights.summary && (
            <div style={{ background: 'rgba(108,99,255,0.08)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
              {insights.summary}
            </div>
          )}
          <div className="grid-2" style={{ gap: 12 }}>
            {insights.salesAnalysis && (
              <div className="ai-insight">
                <div className="ai-insight-label">📈 Sales Analysis</div>
                <p>{insights.salesAnalysis}</p>
              </div>
            )}
            {insights.productInsights && (
              <div className="ai-insight">
                <div className="ai-insight-label">🏆 Product Performance</div>
                <p>{insights.productInsights}</p>
              </div>
            )}
          </div>
          {insights.predictions && (
            <div className="ai-insight" style={{ marginTop: 10 }}>
              <div className="ai-insight-label">🔮 Sales Predictions</div>
              <p>{insights.predictions}</p>
            </div>
          )}
          {insights.suggestions?.length > 0 && (
            <div className="ai-insight" style={{ marginTop: 10 }}>
              <div className="ai-insight-label">💡 Business Suggestions</div>
              <ol className="ai-suggestions">
                {insights.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid-2 chart-section">
        <div className="card">
          <div className="card-title-row">
            <span className="card-title">Revenue Trend</span>
            <TrendingUp size={16} color="var(--text-muted)" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5a6072' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a6072' }} axisLine={false} tickLine={false} tickFormatter={v => formatPrice(v)} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [formatPrice(v), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title-row">
            <span className="card-title">Orders by Status</span>
            <BarChart2 size={16} color="var(--text-muted)" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{v}</span>} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2 chart-section">
        {/* Top Products */}
        <div className="card">
          <div className="card-title">🏆 Top Products by Sales</div>
          <div className="top-products-list">
            {analytics?.topProducts?.map((p, i) => (
              <div key={p._id} className="top-product-item">
                <div className={`top-product-rank rank-${i + 1}`}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.salesCount} sold · {formatPrice(p.price)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="stars">{'★'.repeat(Math.round(p.averageRating || 0))}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.averageRating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="card">
          <div className="card-title">👑 Top Customers</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Orders</th>
                  <th>Spent</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topUsers?.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{u.orderCount}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{formatPrice(u.totalSpent || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders by Geography */}
      <div className="card chart-section">
        <div className="card-title-row">
          <span className="card-title"><Globe size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Orders by Geography</span>
        </div>
        <div className="table-wrapper">
          <table className="geo-table">
            <thead>
              <tr><th>City</th><th>State</th><th>Orders</th><th>Revenue</th><th style={{ width: 120 }}>Share</th></tr>
            </thead>
            <tbody>
              {analytics?.ordersByGeo?.map((g, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{g._id.city}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{g._id.state}</td>
                  <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{g.count}</td>
                  <td style={{ color: 'var(--success)' }}>{formatPrice(g.revenue || 0)}</td>
                  <td>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{Math.round((g.count / maxGeo) * 100)}%</div>
                    <div className="geo-bar-bg"><div className="geo-bar" style={{ width: `${(g.count / maxGeo) * 100}%` }} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
