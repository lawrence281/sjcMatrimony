import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/common/Icon/Icon';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar (Public) */}
      <nav className="absolute top-0 inset-x-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-lg font-serif">M</span>
            </div>
            <span className="text-white font-heading font-bold text-2xl tracking-tight drop-shadow-md">
              Matrimony<span className="text-primary-400">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.LOGIN} className="text-white font-medium hover:text-primary-300 transition-colors drop-shadow-md">Log In</Link>
            <Link to={ROUTES.REGISTER} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-glow border border-primary-500 transition-all">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-white">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase mb-6 text-primary-200">
              India's Most Exclusive Matchmaking
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 drop-shadow-lg">
              Find the love <br />
              <span className="italic text-primary-300">you deserve.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light max-w-xl">
              Join thousands of happy couples who found their perfect match. We blend deep tradition with modern compatibility mapping.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={ROUTES.REGISTER} className="btn bg-primary-600 text-white hover:bg-primary-700 hover:shadow-glow px-8 py-4 text-lg border border-primary-500 flex-1 sm:flex-none">
                Start Your Journey
              </Link>
              <Link to={ROUTES.LOGIN} className="btn bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/30 px-8 py-4 text-lg flex-1 sm:flex-none">
                Browse Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100 -mt-8 relative z-20 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div className="px-4">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2 text-gradient">2M+</h3>
              <p className="text-slate-500 font-medium">Verified Profiles</p>
            </div>
            <div className="px-4">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2 text-gradient">50k+</h3>
              <p className="text-slate-500 font-medium">Happy Marriages</p>
            </div>
            <div className="px-4">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2 text-gradient">100%</h3>
              <p className="text-slate-500 font-medium">Privacy Protected</p>
            </div>
            <div className="px-4">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2 text-gradient">24/7</h3>
              <p className="text-slate-500 font-medium">Expert Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Preview (Static Marketing) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Meet Our Members</h2>
            <p className="text-slate-500 text-lg">Browse through millions of highly educated and verified profiles from your community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop', name: 'Ananya S.', age: 26, loc: 'Mumbai' },
              { img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop', name: 'Rahul V.', age: 29, loc: 'Bangalore' },
              { img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop', name: 'Priya M.', age: 25, loc: 'Delhi' },
            ].map((p, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-card-hover transition-all duration-500 bg-white">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <h3 className="text-white text-2xl font-bold font-serif mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
                    <span>{p.age} Yrs</span>
                    <span>•</span>
                    <span>{p.loc}</span>
                  </div>
                  <Link to={ROUTES.LOGIN} className="w-full btn bg-white/20 hover:bg-primary-600 text-white backdrop-blur-md border border-white/30 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to={ROUTES.REGISTER} className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors text-lg">
              Explore thousands more <Icon name="chevronRight" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-primary-600/20 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Ready to start your happily ever after?</h2>
          <p className="text-xl text-slate-300 mb-10 font-light">Join today and connect with thousands of like-minded individuals looking for a meaningful relationship.</p>
          <Link to={ROUTES.REGISTER} className="btn bg-primary-600 text-white hover:bg-primary-700 hover:shadow-glow px-10 py-5 text-xl font-bold border border-primary-500">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer (Simplified for public home) */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-lg font-serif">M</span>
          </div>
          <p className="mb-4">© {new Date().getFullYear()} Matrimony Platform. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
