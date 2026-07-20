import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Imagery & Branding */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200&h=1600" 
            alt="Wedding Couple" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-16 inline-flex">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-lg font-serif">M</span>
            </div>
            <span className="text-white font-heading font-bold text-2xl tracking-tight drop-shadow-md">
              Matrimony<span className="text-primary-400">.</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto">
          <blockquote className="text-white text-3xl font-serif leading-tight mb-8 drop-shadow-lg">
            "Finding your life partner is one of the most important decisions. 
            <br/><span className="text-primary-300 italic">We're here to make it beautiful.</span>"
          </blockquote>
          
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 inline-flex">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Happy user"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">50,000+ Couples</p>
              <p className="text-white/80 text-xs">Found their perfect match</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50 relative">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-primary-100/40 blur-3xl opacity-60"></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] rounded-full bg-accent-100/40 blur-3xl opacity-60"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold font-serif">M</span>
            </div>
            <span className="text-slate-900 font-heading font-bold text-2xl tracking-tight">
              Matrimony<span className="text-primary-500">.</span>
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-card border border-white p-8 sm:p-10 animate-scale-in">
            <Outlet />
          </div>
          
          <p className="text-center text-slate-400 text-xs mt-8 lg:hidden">
            © {new Date().getFullYear()} Matrimony Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
