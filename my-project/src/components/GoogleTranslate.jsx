import React, { useEffect, useRef } from 'react';

const GoogleTranslate = () => {
  const googleTranslateRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const loadGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        initializeTranslate();
      } else {
        // Create script element if it doesn't exist
        if (!document.querySelector('script[src*="translate.google.com"]')) {
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          document.body.appendChild(script);
        }
        
        window.googleTranslateElementInit = initializeTranslate;
      }
    };

    const initializeTranslate = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,es,fr,de',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element_hidden'
        );
        
        // Dispatch custom event when ready
        const event = new CustomEvent('GoogleTranslateReady');
        window.dispatchEvent(event);
        initializedRef.current = true;
      } catch (error) {
        console.error('Google Translate initialization error:', error);
      }
    };

    loadGoogleTranslate();

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div
      id="google_translate_element_hidden"
      ref={googleTranslateRef}
      style={{ display: 'none' }}
    />
  );
};

export default GoogleTranslate;