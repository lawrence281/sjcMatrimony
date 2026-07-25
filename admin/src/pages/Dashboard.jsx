import { useState, useEffect } from 'react'
import { Users, UserCheck, Clock, Crown, TrendingUp, Sparkles, BarChart2, RefreshCw, Heart } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../services/api'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  Active: '#22c55e',
  Pending: '#f59e0b',
  Suspended: '#ef4444',
  Rejected: '#6b7280',
}

const MEMBERSHIP_COLORS = {
  Free: '#6b7280',
  Silver: '#94a3b8',
  Gold: '#f59e0b',
  Platinum: '#8b5cf6',
}

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

  const monthlyData = analytics?.monthlyRegistrations?.map(m => ({
    name: MONTH_NAMES[m._id.month], registrations: m.count
  })) || []

  const statusData = analytics?.profilesByStatus?.map(s => ({
    name: s._id || 'Pending',
    value: s.count,
    color: STATUS_COLORS[s._id] || '#6c63ff'
  })) || []

  const membershipData = analytics?.profilesByMembership?.map(m => ({
    name: m._id || 'Free',
    value: m.count,
    color: MEMBERSHIP_COLORS[m._id] || '#6c63ff'
  })) || []

  const genderData = analytics?.profilesByGender?.map(g => ({
    name: g._id || 'Not specified', value: g.count
  })) || []

  return (
    <div>
      <div className="page-header-row page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Monitor your matrimony platform here.</p>
        </div>
        <button className="btn btn-primary" onClick={generateInsights} disabled={loadingAI}>
          <Sparkles size={16} />
          {loadingAI ? 'Analyzing...' : 'Generate AI Insights'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-purple"><Users size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Members</div>
            <div className="stat-value">{analytics?.totalUsers || 0}</div>
            <div className="stat-change">↑ Registered</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-green"><Heart size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Profiles</div>
            <div className="stat-value">{analytics?.totalProfiles || 0}</div>
            <div className="stat-change">↑ All time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-blue"><UserCheck size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Active Profiles</div>
            <div className="stat-value">{analytics?.activeProfiles || 0}</div>
            <div className="stat-change">In platform</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-orange"><Clock size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">Pending Verifications</div>
            <div className="stat-value">{analytics?.pendingVerifications || 0}</div>
            <div className="stat-change">Awaiting review</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {insights && (
        <div className="ai-panel" style={{ marginBottom: 24 }}>
          <div className="ai-panel-header">
            <div className="ai-panel-title">
              <Sparkles size={18} color="var(--accent-light)" />
              Claude AI Platform Insights
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
                <div className="ai-insight-label">📈 Membership Analysis</div>
                <p>{insights.salesAnalysis}</p>
              </div>
            )}
            {insights.productInsights && (
              <div className="ai-insight">
                <div className="ai-insight-label">👤 Profile Quality</div>
                <p>{insights.productInsights}</p>
              </div>
            )}
          </div>
          {insights.predictions && (
            <div className="ai-insight" style={{ marginTop: 10 }}>
              <div className="ai-insight-label">🔮 Growth Predictions</div>
              <p>{insights.predictions}</p>
            </div>
          )}
          {insights.suggestions?.length > 0 && (
            <div className="ai-insight" style={{ marginTop: 10 }}>
              <div className="ai-insight-label">💡 Platform Suggestions</div>
              <ol className="ai-suggestions">
                {insights.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid-2 chart-section">
        <div className="card">
          <div className="card-title-row">
            <span className="card-title">Monthly Registrations</span>
            <TrendingUp size={16} color="var(--text-muted)" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5a6072' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a6072' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={v => [v, 'Registrations']} />
                <Area type="monotone" dataKey="registrations" stroke="#6c63ff" strokeWidth={2} fill="url(#regGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title-row">
            <span className="card-title">Profile Status Distribution</span>
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

      {/* Charts Row 2 */}
      <div className="grid-2 chart-section">
        {/* Membership Breakdown */}
        <div className="card">
          <div className="card-title">👑 Membership Breakdown</div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={membershipData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#5a6072' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#5a6072' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {membershipData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Profiles */}
        <div className="card">
          <div className="card-title">🆕 Recent Profiles</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Status</th>
                  <th>Membership</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentProfiles?.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : p.userId?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.gender || ''}</div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: STATUS_COLORS[p.profileStatus] ? `${STATUS_COLORS[p.profileStatus]}22` : 'rgba(108,99,255,0.1)',
                        color: STATUS_COLORS[p.profileStatus] || '#6c63ff',
                        fontWeight: 600,
                      }}>
                        {p.profileStatus || 'Pending'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-light)', fontWeight: 600, fontSize: 12 }}>
                      {p.membershipType || 'Free'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gender Distribution */}
      {genderData.length > 0 && (
        <div className="card chart-section">
          <div className="card-title-row">
            <span className="card-title">👫 Gender Distribution</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {genderData.map((g, i) => {
              const total = genderData.reduce((sum, d) => sum + d.value, 0)
              const pct = total > 0 ? Math.round((g.value / total) * 100) : 0
              return (
                <div key={i} style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{g.name}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-light)' }}>{g.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{pct}% of total</div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--border)' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: i === 0 ? '#6c63ff' : '#ec4899' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
