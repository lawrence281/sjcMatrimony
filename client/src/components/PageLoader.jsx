import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Preparing the fun...');

  const creativePhrases = [
    'Igniting the fuse...',
    'Lighting up your screen...',
    'Preparing the big bang!',
    'Setting the stage for sparks...',
    'Loading the crackers...',
    'Get ready for the boom!',
    'Priming the rockets...',
    'Connecting the chain crackers...'
  ];

  useEffect(() => {
    // Pick a random phrase on each navigation
    const randomPhrase = creativePhrases[Math.floor(Math.random() * creativePhrases.length)];
    setLoadingText(randomPhrase);
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Faster transition

    return () => clearTimeout(timer);
  }, [location]);

  if (!isLoading) return null;

  return (
    <div className="page-loader-transparent">
      <div className="bomb-loader-container">
        <svg className="bomb-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="60" r="30" className="bomb-body" />
          <path d="M50 30 L50 20 Q60 15 70 20" className="bomb-wick" fill="none" strokeWidth="4" />
          <g className="spark-animation">
            <circle cx="72" cy="18" r="4" fill="#ffcc00">
              <animate attributeName="opacity" values="1;0;1" dur="0.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="76" cy="14" r="2" fill="#ff4d00">
              <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
        <div className="bomb-text">{loadingText}</div>
      </div>
    </div>
  );
};

export default PageLoader;
