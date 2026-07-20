import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/common/Icon/Icon';

const Footer = () => (
  <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Brand & Mission */}
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center gap-3 mb-6 inline-flex">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg font-serif">M</span>
            </div>
            <span className="font-heading font-bold text-2xl text-white tracking-tight">
              Matrimony<span className="text-primary-400">.</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
            India's most exclusive matchmaking platform. We blend tradition with modern technology to help you find your perfect life partner.
          </p>
          <div className="flex items-center gap-4">
            {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                {/* Fallback to simple SVG shape if no specific social icon is loaded */}
                <Icon name="heart" size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2 lg:col-start-6">
          <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-slate-200">Platform</h4>
          <ul className="space-y-3.5 text-sm text-slate-400">
            <li><Link to={ROUTES.CLIENT.SEARCH} className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> Search Profiles</Link></li>
            <li><Link to={ROUTES.CLIENT.PLANS}  className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> Membership Plans</Link></li>
            <li><Link to="/success-stories" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> Success Stories</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-slate-200">Company</h4>
          <ul className="space-y-3.5 text-sm text-slate-400">
            <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> About Us</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> Contact</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><Icon name="chevronRight" size={14} /> Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact & App */}
        <div className="lg:col-span-3">
          <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-slate-200">Support</h4>
          <ul className="space-y-3.5 text-sm text-slate-400 mb-8">
            <li><a href="mailto:support@matrimony.com" className="hover:text-white transition-colors flex items-center gap-3"><Icon name="message" size={16} className="text-primary-400" /> support@matrimony.com</a></li>
            <li><a href="tel:+919000000000" className="hover:text-white transition-colors flex items-center gap-3"><Icon name="user" size={16} className="text-primary-400" /> +91 900 000 0000</a></li>
          </ul>
          
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Get the App</p>
            <div className="flex gap-3">
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
                <Icon name="star" size={18} />
                <div className="text-left">
                  <div className="text-[10px] leading-tight text-slate-400">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Matrimony Platform. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span>Built with</span>
          <Icon name="heart" size={16} className="text-danger animate-pulse-slow" />
          <span>for families across India</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
