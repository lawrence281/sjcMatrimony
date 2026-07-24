import React from 'react';
import { ShieldCheck, Flame, Shirt, Leaf, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function SafetyRules() {
  const safetySections = [
    {
      title: "General Safety",
      icon: <ShieldCheck size={28} className="text-white" />,
      color: "linear-gradient(135deg, #f97316, #ea580c)",
      rules: [
        "Read instructions carefully before use",
        "Use fireworks only in open outdoor areas",
        "Keep a safe distance from others",
        "Supervise small children closely"
      ]
    },
    {
      title: "While Lighting Firecrackers",
      icon: <Flame size={28} className="text-white" />,
      color: "linear-gradient(135deg, #ef4444, #dc2626)",
      rules: [
        "Use a long incense stick (agarbathi)",
        "Light one cracker at a time",
        "Never try to relight dud firecrackers",
        "Avoid holding crackers in hand"
      ]
    },
    {
      title: "Protective Measures",
      icon: <Shirt size={28} className="text-white" />,
      color: "linear-gradient(135deg, #84cc16, #65a30d)",
      rules: [
        "Wear comfortable cotton clothes",
        "Keep a bucket of water or sand ready",
        "Avoid wearing loose or synthetic clothing"
      ]
    },
    {
      title: "Environmental Safety",
      icon: <Leaf size={28} className="text-white" />,
      color: "linear-gradient(135deg, #0ea5e9, #0284c7)",
      rules: [
        "Use low-noise and eco-friendly crackers",
        "Avoid bursting in crowded or sensitive areas",
        "Dispose of used crackers properly"
      ]
    },
    {
      title: "Emergency Tips",
      icon: <PhoneCall size={28} className="text-white" />,
      color: "linear-gradient(135deg, #a855f7, #9333ea)",
      className: "infographic-card-full",
      rules: [
        "Cool burns immediately with cold water",
        "Keep a first aid kit easily accessible",
        "Call for help or emergency services if needed"
      ]
    }
  ];

  return (
    <div className="infographic-page section">
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="infographic-header">
          <h1 className="infographic-title">
            <span className="sparkle">✨</span> Firecracker Safety Rules <span className="sparkle">✨</span>
          </h1>
          <p className="infographic-subtitle">Stay Safe & Celebrate Responsibly!</p>
        </div>

        <div className="infographic-grid">
          {safetySections.map((section, index) => (
            <div 
              key={index} 
              className={`infographic-card ${section.className || ''}`}
              style={{ background: section.color }}
            >
              <div className="infographic-card-header">
                <div className="infographic-icon">
                  {section.icon}
                </div>
                <h2>{section.title}</h2>
              </div>
              <ul className="infographic-rules">
                {section.rules.map((rule, idx) => (
                  <li key={idx}>
                    <CheckCircle2 className="rule-checkmark" size={20} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="infographic-footer">
          <h3>Stay Safe & Celebrate Responsibly!</h3>
        </div>
      </div>
    </div>
  );
}
