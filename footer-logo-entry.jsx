import React from 'react';
import { createRoot } from 'react-dom/client';
import TiltedCard from './TiltedCard';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const footerLogoContainer = document.getElementById('footer-tilted-logo');
  
  if (footerLogoContainer) {
    const root = createRoot(footerLogoContainer);
    root.render(
      <TiltedCard
        imageSrc="./images/logo.png"
        altText="CSA Entertainment Logo"
        captionText="CSA Entertainment"
        containerHeight="220px"
        containerWidth="220px"
        imageHeight="220px"
        imageWidth="220px"
        rotateAmplitude={15}
        scaleOnHover={1.1}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={false}
      />
    );
  }
});