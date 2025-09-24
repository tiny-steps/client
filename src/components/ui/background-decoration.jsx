import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  Heart, 
  Star, 
  Sparkles, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Shield,
  Activity,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';

// Professional icons suitable for admin dashboard
const AdminIcons = {
  Heart,
  Star, 
  Sparkles,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Shield,
  Activity,
  BookOpen,
  Target,
  TrendingUp
};

const AdminBackgroundDecoration = ({ 
  variant = 'default',
  opacity = 0.3,
  enableAnimations = true,
  iconSet = ['Users', 'Calendar', 'BarChart3', 'Shield', 'Activity']
}) => {
  const floatingElementsRef = useRef([]);

  // GSAP animations for floating elements (more subtle for admin interface)
  useEffect(() => {
    if (!enableAnimations) return;
    
    const elements = floatingElementsRef.current;

    elements.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: -15, // Reduced movement for professional look
          rotation: 3, // Subtle rotation
          duration: 4 + index * 0.8, // Slower, more professional timing
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.6,
        });
      }
    });

    return () => {
      elements.forEach(el => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [enableAnimations]);

  const getBackgroundClass = () => {
    switch (variant) {
      case 'dashboard':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
      case 'patients':
        return 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50';
      case 'doctors':
        return 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50';
      case 'schedule':
        return 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50';
      case 'reports':
        return 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50';
      default:
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100';
    }
  };

  const getFloatingPositions = () => [
    { top: '10%', left: '8%' },
    { top: '15%', right: '12%' },
    { top: '45%', left: '15%' },
    { bottom: '25%', right: '8%' },
    { bottom: '15%', left: '10%' }
  ];

  return (
    <div className={`absolute inset-0 ${getBackgroundClass()} transition-all duration-500 ease-in-out`}>
      {/* Professional floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {getFloatingPositions().map((position, index) => {
          if (index >= iconSet.length) return null;
          
          const IconComponent = AdminIcons[iconSet[index]];
          if (!IconComponent) return null;

          return (
            <div
              key={index}
              ref={(el) => (floatingElementsRef.current[index] = el)}
              className="absolute transition-opacity duration-300"
              style={{
                ...position,
                opacity: opacity,
                color: variant === 'dashboard' ? '#6366f1' : 
                       variant === 'patients' ? '#10b981' :
                       variant === 'doctors' ? '#8b5cf6' :
                       variant === 'schedule' ? '#f59e0b' :
                       variant === 'reports' ? '#6b7280' : '#a855f7'
              }}
            >
              <IconComponent size={64} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Subtle overlay for better content readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
    </div>
  );
};

export default AdminBackgroundDecoration;