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
                  <p>support@dkingite.com</p>
                  <p>ops@dkingite.com</p>
                </div>
              </div>

              <div className="info-item-card">
                <div className="info-icon-modern"><Phone size={24} /></div>
                <div className="info-text-modern">
                  <h4>Hotline</h4>
                  <p>+1 (888) SKY-FIRE</p>
                  <p>Mon - Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="info-item-card">
                <div className="info-icon-modern"><MapPin size={24} /></div>
                <div className="info-text-modern">
                  <h4>Headquarters</h4>
                  <p>123 Pyrotechnic Ave</p>
                  <p>Las Vegas, NV 89101</p>
                </div>
              </div>

              <div className="info-item-card">
                <div className="info-icon-modern"><Instagram size={24} /></div>
                <div className="info-text-modern">
                  <h4>{t('social_media')}</h4>
                  <p>@dkingite_fire</p>
                  <p>@dkingite_ops</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
