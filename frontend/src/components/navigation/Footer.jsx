import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const Footer = () => (
  <footer className="bg-neutral-900 text-white py-12 mt-auto">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-lg">Matrimony</span>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            India's most trusted matrimony platform connecting hearts across the nation.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Platform</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li><Link to={ROUTES.CLIENT.SEARCH} className="hover:text-white transition-colors">Search Profiles</Link></li>
            <li><Link to={ROUTES.CLIENT.PLANS}  className="hover:text-white transition-colors">Membership Plans</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Company</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-300">Support</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li><a href="mailto:support@matrimony.com" className="hover:text-white transition-colors">support@matrimony.com</a></li>
            <li><a href="tel:+919000000000" className="hover:text-white transition-colors">+91 900 000 0000</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-neutral-500 text-sm">
          © {new Date().getFullYear()} Matrimony Platform. All rights reserved.
        </p>
        <p className="text-neutral-600 text-xs">Built with ❤️ for families across India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
