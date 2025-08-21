'use client';

import { useEffect, useState } from 'react';

interface CartNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function CartNotification({ 
  message, 
  onClose, 
  duration = 3000 
}: CartNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`cart-notification ${isVisible ? 'show' : 'hide'}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          borderRadius: '50%', 
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}>
          ✓
        </div>
        <span>{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '8px',
            opacity: 0.7,
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
