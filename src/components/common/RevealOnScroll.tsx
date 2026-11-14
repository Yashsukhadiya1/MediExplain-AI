import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom';
  threshold?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.02,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Immediate fallback safety timer: ensure content is NEVER stuck invisible on mobile
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 600 + delay);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return () => clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        // Generous positive rootMargin so content pre-loads and reveals smoothly BEFORE or as soon as it hits screen
        rootMargin: '120px 0px 60px 0px',
      }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (el) observer.unobserve(el);
    };
  }, [threshold, delay]);

  const getTransformStyle = () => {
    if (isVisible) return 'translate-x-0 translate-y-0 scale-100 opacity-100';

    switch (direction) {
      case 'up':
        return 'translate-y-3 sm:translate-y-6 opacity-0';
      case 'down':
        return '-translate-y-3 sm:-translate-y-6 opacity-0';
      case 'left':
        return 'translate-x-3 sm:translate-x-6 opacity-0';
      case 'right':
        return '-translate-x-3 sm:-translate-x-6 opacity-0';
      case 'zoom':
        return 'scale-98 opacity-0';
      default:
        return 'translate-y-3 sm:translate-y-6 opacity-0';
    }
  };

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out transform will-change-[opacity,transform] ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
};

