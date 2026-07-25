import { createContext, useContext } from 'react'

const translations = {
  en: {
    // Navbar
    search_placeholder: 'Search...',
    my_profile: 'My Profile',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    my_account: 'My Account',
    contact_support: 'Contact Support',
    safety_guide: 'Safety Guidelines',
    
    // Contact
    contact_title: 'Get in Touch',
    contact_subtitle: 'Have questions or need assistance? Our team is here to help.',
    send_message: 'Send Message',
    contact_info: 'Our Office',
    social_media: 'Social Media',

    // Hero
    hero_tag: 'TRUSTED MATRIMONY PLATFORM',
    hero_title: 'Find Your Perfect Life Partner',
    hero_subtitle: 'Connect with compatible matches within the SJC community. Safe, verified, and community-driven.',

    // Showcase
    trending_now: 'Showcase',

    // Newsletter
    newsletter_title: 'Stay Connected',
    newsletter_desc: 'Join our community for updates and announcements.',
    newsletter_placeholder: 'Enter your email',
    notify_me: 'Join Now',

    // General
    view_all: 'View All',
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
