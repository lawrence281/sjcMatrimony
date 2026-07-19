import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminAPI.getDashboardStats()
      .then((res) => setStats(res.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: loading ? '…' : (stats?.totalUsers ?? '—'),
      icon: '👥',
      color: 'from-primary-500 to-primary-700',
      link: ROUTES.ADMIN.USERS,
    },
    {
      label: 'Active Profiles',
      value: loading ? '…' : (stats?.activeProfiles ?? '—'),
      icon: '👤',
      color: 'from-blue-500 to-blue-700',
      link: ROUTES.ADMIN.PROFILES,
    },
    {
      label: 'Revenue (MTD)',
      value: loading ? '…' : stats?.revenueMtd != null ? `₹${stats.revenueMtd.toLocaleString()}` : '—',
      icon: '💰',
      color: 'from-green-500 to-green-700',
      link: ROUTES.ADMIN.PAYMENTS,
    },
    {
      label: 'Pending Approvals',
      value: loading ? '…' : (stats?.pendingApprovals ?? '—'),
      icon: '⏳',
      color: 'from-orange-500 to-orange-700',
      link: ROUTES.ADMIN.PROFILES,
    },
  ];

  const quickLinks = [
    { label: 'Review pending profiles', path: ROUTES.ADMIN.PROFILES + '?status=pending', icon: '👤' },
    { label: 'View abuse reports', path: ROUTES.ADMIN.REPORTS, icon: '🚩' },
    { label: 'Manage team members', path: ROUTES.ADMIN.ADMINS, icon: '👥' },
    { label: 'Platform settings', path: ROUTES.ADMIN.SETTINGS, icon: '⚙️' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="stat-card group hover:shadow-md transition-shadow">
            <div className={`stat-icon bg-gradient-to-br ${card.color} shadow-md`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div>
              <p className="stat-value">{card.value}</p>
              <p className="stat-label">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
        <h2 className="text-base font-bold font-heading text-neutral-800">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map((ql) => (
            <Link
              key={ql.label}
              to={ql.path}
              className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 border border-neutral-100 hover:border-primary-200 transition-all group"
            >
              <span className="text-xl">{ql.icon}</span>
              <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-700 transition-colors">
                {ql.label}
              </span>
              <span className="ml-auto text-neutral-300 group-hover:text-primary-500 transition-colors">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
