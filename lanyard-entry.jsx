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
  
  console.log('✅ Lanyard component mounted successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanyard);
} else {
  initLanyard();
}

export { initLanyard };