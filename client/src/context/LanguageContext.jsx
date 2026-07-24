import { createContext, useContext } from 'react'

const translations = {
  en: {
    // Navbar
    shop_all: 'Shop All',
    search_placeholder: 'Search...',
    my_wishlist: 'My Wishlist',
    my_profile: 'My Profile',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    my_account: 'My Account',
    contact_support: 'Contact Support',
    combo_pack: 'Combo Pack',
    
    // Contact
    contact_title: 'Get in Touch',
    contact_subtitle: 'Have questions or need assistance? Our expert pyrotechnicians are here to help.',
    send_message: 'Send Mission Briefing',
    contact_info: 'Base of Operations',
    social_media: 'Social Media',

    hero_tag: 'PROFESSIONAL GRADE',
    hero_title: 'Ignite the Night with Style',
    hero_subtitle: 'Premium pyrotechnics for celebratory displays. Safe, loud, and unforgettable.',
    shop_now: 'Shop Arsenal',
    safety_guide: 'Safety Guide',
    trending_now: 'Showcase',
    new_arrivals: 'New Arrivals',
    featured_products: 'Featured Products',
    categories_title: 'Curated Categories',
    view_all: 'View All',
    newsletter_title: 'Get Seasonal Alerts',
    newsletter_desc: 'Join our priority list for stock updates and safety guides.',
    newsletter_placeholder: 'Enter your email',
    notify_me: 'Notify Me',
    
    // Products
    all_effects: 'All Effects',
    price_range: 'Price Range',
    min_reviews: 'Min Reviews',
    clear_filters: 'Clear all filters',
    sort_by: 'Sort by',
    sort_newest: 'Newest',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    sort_popularity: 'Popularity',
    sort_rating: 'Rating',
    no_products: 'No products found',
    try_adjusting: 'Try adjusting your filters',
    
    // Combo Pack
    combo_title: 'Premium Combo Packs',
    combo_subtitle: 'Maximize your display with our expertly curated pyrotechnic assortments. Professional grade combinations at exceptional value.',
    no_combos: 'No combo products available',
    check_back_soon: 'We are currently preparing new exciting combo offers. Please check back later.',
    
    // Cart
    your_cart: 'Your Cart',
    cart_empty: 'Your cart is empty',
    continue_shopping: 'Continue Shopping',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    remove: 'Remove',
    
    // Product Detail
    add_to_cart: 'Add to Cart',
    out_of_stock: 'Out of Stock',
    in_stock: 'In stock',
    left: 'left',
    low_stock_warn: 'Only {count} left!',
    save_to_wishlist: 'Save to Target List',
    saved_to_wishlist: 'Saved to Target List',
    customer_reviews: 'Customer Reviews',
    no_reviews: 'No reviews yet.',
    verified_buyer: 'Verified Buyer',
  }
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const t = (key, params = {}) => {
    let text = translations['en'][key] || key
    
    Object.keys(params).forEach(p => {
      text = text.replace(`{${p}}`, params[p])
    })
    
    return text
  }

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
