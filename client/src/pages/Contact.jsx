import { Mail, Phone, MapPin, Instagram, Twitter } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <div className="contact-page">
      <div className="container overflow-hidden">
        <div className="contact-hero">
          <div className="section-tag">{t('contact_support')}</div>
          <h1 className="contact-title">{t('contact_title')}</h1>
          <p className="contact-subtitle">{t('contact_subtitle')}</p>
        </div>

        <div className="contact-details-wrapper">
          <div className="contact-info-card-horizontal">
            <h2 className="info-title-centered">{t('contact_info')}</h2>
            
            <div className="info-items-grid">
              <div className="info-item-card">
                <div className="info-icon-modern"><Mail size={24} /></div>
                <div className="info-text-modern">
                  <h4>Email</h4>
                  <p>support@sjcmatrimony.org</p>
                  <p>info@sjcmatrimony.org</p>
                </div>
              </div>

              <div className="info-item-card">
                <div className="info-icon-modern"><Phone size={24} /></div>
                <div className="info-text-modern">
                  <h4>Hotline</h4>
                  <p>+91 44 2468 1357</p>
                  <p>Mon - Sat, 9am - 6pm IST</p>
                </div>
              </div>

              <div className="info-item-card">
                <div className="info-icon-modern"><MapPin size={24} /></div>
                <div className="info-text-modern">
                  <h4>Office</h4>
                  <p>St. Joseph Cathedral Complex</p>
                  <p>Chennai, TN, India</p>
                </div>
              </div>

              <div className="info-item-card">
                <div className="info-icon-modern"><Instagram size={24} /></div>
                <div className="info-text-modern">
                  <h4>Social Media</h4>
                  <p>@sjcmatrimony</p>
                  <p>fb.com/sjcmatrimony</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
