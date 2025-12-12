/**
 * Lanyard Entry Point
 * Mounts the React Lanyard component into the hero section
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard.jsx';

// Wait for DOM to be ready
function initLanyard() {
  const mountPoint = document.getElementById('lanyard-mount');

  if (!mountPoint) {
    console.error('Lanyard mount point not found! Make sure you have <div id="lanyard-mount"></div> in your HTML.');
    return;
  }

  // Hide the mount point initially to prevent visual glitches
  mountPoint.style.opacity = '0';
  mountPoint.style.transition = 'opacity 0.6s ease-out';

  const root = createRoot(mountPoint);

  root.render(
    <React.StrictMode>
      <Lanyard
        position={[0, 0, 20]}
        gravity={[0, -50, 0]}
        fov={15}
        transparent={true}
      />
    </React.StrictMode>
  );

  // Wait for physics to settle before showing (prevent initial "pop" or erratic movement)
  setTimeout(() => {
    mountPoint.style.opacity = '1';
    console.log('✅ Lanyard component mounted and visible');
  }, 800); // Give physics simulation time to stabilize
}

// Initialize when DOM is ready AND after a brief delay to ensure loader completes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure loader has started its exit animation
    setTimeout(initLanyard, 100);
  });
} else {
  // If DOM is already loaded, still add small delay
  setTimeout(initLanyard, 100);
}

export { initLanyard };