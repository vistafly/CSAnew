import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

// ADD THIS CLAMPING FUNCTION
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false
}) {
  const ref = useRef(null);
  const x = useMotionValue();
  const y = useMotionValue();
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    function handleGlobalMouse(e) {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;
      
      // Calculate rotation angles
      const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
      const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
      
      // Clamp rotation values to prevent extreme angles
      const maxRotation = 35; // Maximum tilt angle in degrees
      const clampedRotationX = clamp(rotationX, -maxRotation, maxRotation);
      const clampedRotationY = clamp(rotationY, -maxRotation, maxRotation);
      
      // Apply clamped rotations
      rotateX.set(clampedRotationX);
      rotateY.set(clampedRotationY);
      
      if (isHovered) {
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        
        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
      }
    }

    document.addEventListener('mousemove', handleGlobalMouse);
    return () => document.removeEventListener('mousemove', handleGlobalMouse);
  }, [rotateX, rotateY, x, y, rotateFigcaption, lastY, rotateAmplitude, isHovered]);

  function handleMouseEnter() {
    setIsHovered(true);
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    opacity.set(0);
    scale.set(1);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height: containerHeight,
        width: containerWidth,
        background: 'transparent'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}
      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        {/* DEPTH LAYER 5 - Deepest shadow */}
        <motion.div
          style={{
            position: 'absolute',
            width: '106%',
            height: '106%',
            left: '-3%',
            top: '-3%',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '15px',
            transform: 'translateZ(-50px)',
            filter: 'blur(18px)',
            opacity: 0.7
          }}
        />
        
        {/* DEPTH LAYER 4 - Far shadow */}
        <motion.div
          style={{
            position: 'absolute',
            width: '105%',
            height: '105%',
            left: '-2.5%',
            top: '-2.5%',
            background: 'rgba(20, 20, 20, 0.6)',
            borderRadius: '15px',
            transform: 'translateZ(-35px)',
            filter: 'blur(14px)',
            opacity: 0.75
          }}
        />
        
        {/* DEPTH LAYER 3 - Mid shadow */}
        <motion.div
          style={{
            position: 'absolute',
            width: '104%',
            height: '104%',
            left: '-2%',
            top: '-2%',
            background: 'rgba(40, 40, 40, 0.7)',
            borderRadius: '15px',
            transform: 'translateZ(-25px)',
            filter: 'blur(10px)',
            opacity: 0.8
          }}
        />
        
        {/* DEPTH LAYER 2 - Close shadow */}
        <motion.div
          style={{
            position: 'absolute',
            width: '102%',
            height: '102%',
            left: '-1%',
            top: '-1%',
            background: 'rgba(60, 60, 60, 0.8)',
            borderRadius: '15px',
            transform: 'translateZ(-15px)',
            filter: 'blur(6px)',
            opacity: 0.85
          }}
        />
        
        {/* DEPTH LAYER 1 - Immediate shadow */}
        <motion.div
          style={{
            position: 'absolute',
            width: '101%',
            height: '101%',
            left: '-0.5%',
            top: '-0.5%',
            background: 'rgba(80, 80, 80, 0.9)',
            borderRadius: '15px',
            transform: 'translateZ(-8px)',
            filter: 'blur(3px)',
            opacity: 0.9
          }}
        />
        
        {/* SHADOW DIRECTLY BEHIND IMAGE - Top layer */}
        <motion.div
          style={{
            position: 'absolute',
            width: '103%',
            height: '103%',
            left: '-1.5%',
            top: '-1.5%',
            background: 'radial-gradient(circle, rgba(90, 90, 90, 0.4) 0%, rgba(120, 120, 120, 0.25) 50%, rgba(150, 150, 150, 0.12) 70%, transparent 85%)',
            borderRadius: '15px',
            transform: 'translateZ(-6px)',
            filter: 'blur(10px)',
            opacity: 0.65,
            zIndex: 5
          }}
        />
        
        {/* FRONT IMAGE with subtle edge definition */}
        <motion.img
          src={imageSrc}
          alt={altText}
          className="tilted-card-img"
          style={{
            width: imageWidth,
            height: imageHeight,
            position: 'relative',
            zIndex: 10,
            background: 'transparent',
            filter: isHovered 
              ? 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3)) brightness(1.08) contrast(1.05)' 
              : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))',
            transition: 'filter 0.3s ease'
          }}
        />
        
        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
        )}
      </motion.div>
      {showTooltip && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}