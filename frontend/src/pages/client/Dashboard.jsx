import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/common/Icon/Icon';

const ClientDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-800 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-primary-600/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-accent-600/10 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase mb-4 text-primary-300">
              {user?.profile?.isPremium ? 'Premium Member' : 'Free Member'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-3 tracking-tight">
              Welcome back, {user?.profile?.firstName || 'User'}!
            </h1>
            <p className="text-slate-300 text-lg">
              Your profile is <strong className="text-white">65% complete</strong>. Complete your profile to get 3x more matches.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link to={ROUTES.CLIENT.EDIT_PROFILE} className="btn bg-primary-600 text-white hover:bg-primary-700 shadow-glow px-6 py-2.5 rounded-xl font-bold border border-primary-500">
                Complete Profile
              </Link>
            </div>
          </div>
          
          {/* Circular Progress (CSS only representation) */}
          <div className="hidden lg:flex items-center justify-center shrink-0 w-32 h-32 rounded-full border-8 border-slate-800 relative">
             <div className="absolute inset-[-8px] rounded-full border-8 border-primary-500 border-t-transparent border-r-transparent transform -rotate-45"></div>
             <div className="text-center">
               <span className="block text-2xl font-bold text-white">65%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Profile Views', value: '124', icon: 'image', color: 'text-primary-500', bg: 'bg-primary-50' },
          { label: 'Interests Received', value: '12', icon: 'heart', color: 'text-danger', bg: 'bg-danger-light' },
          { label: 'Shortlisted By', value: '8', icon: 'star', color: 'text-accent-600', bg: 'bg-accent-50' },
          { label: 'New Matches', value: '35', icon: 'user', color: 'text-success-600', bg: 'bg-success-light' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <Icon name={stat.icon} size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold font-serif text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">Recent Matches</h2>
            <Link to={ROUTES.CLIENT.SEARCH} className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1 text-sm">
              View All <Icon name="chevronRight" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-card-hover transition-all duration-300">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop&sig=${i}`} alt="Match" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-serif font-bold text-xl drop-shadow-md">Aarti S.</h3>
                    <p className="text-xs font-medium text-white/90 drop-shadow-md">26 Yrs • Mumbai</p>
                  </div>
                </div>
                <div className="p-5 flex gap-2">
                   <button className="flex-1 btn bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white border border-primary-100 py-2.5 rounded-xl font-bold transition-all text-sm">Connect</button>
                   <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:text-danger hover:bg-danger-light hover:border-danger/30 transition-all">
                     <Icon name="heart" size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <Icon name="star" size={32} className="text-primary-200 mb-4" />
            <h3 className="text-xl font-bold font-serif mb-2">Upgrade to Premium</h3>
            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
              Get up to 10x more matches, view contact details, and send unlimited messages.
            </p>
            <Link to={ROUTES.CLIENT.PLANS} className="block w-full text-center bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 rounded-xl transition-colors shadow-sm">
              View Plans
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
            <h3 className="font-bold font-serif text-slate-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to={ROUTES.CLIENT.EDIT_PROFILE} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary-600 transition-colors group">
                <div className="flex items-center gap-3"><Icon name="user" size={18} /> Edit Profile</div>
                <Icon name="chevronRight" size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to={ROUTES.CLIENT.INTERESTS} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary-600 transition-colors group">
                <div className="flex items-center gap-3"><Icon name="message" size={18} /> My Interests</div>
                <Icon name="chevronRight" size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to={ROUTES.CLIENT.SHORTLIST} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary-600 transition-colors group">
                <div className="flex items-center gap-3"><Icon name="star" size={18} /> Shortlisted Profiles</div>
                <Icon name="chevronRight" size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
