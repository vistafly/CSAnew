// BULLETPROOF LOADER - Cannot get stuck
(function() {
    'use strict';
    
    let isComplete = false;
    let progressValue = 0;
    let progressBar;
    const circumference = 2 * Math.PI * 150;
    
    // Prevent scrolling
    function lockScroll() {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    
    function unlockScroll() {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('loading-active');
        document.documentElement.classList.remove('loading-active');
    }
    
    // Safe progress update
    function updateProgress(target) {
        if (!progressBar) return;
        
        const animate = () => {
            const diff = target - progressValue;
            progressValue += diff * 0.15;
            
            const offset = circumference - (progressValue / 100) * circumference;
            progressBar.style.strokeDashoffset = offset;
            
            if (Math.abs(diff) > 0.5) {
                requestAnimationFrame(animate);
            } else {
                progressValue = target;
                if (target >= 100) {
                    setTimeout(completeLoader, 300);
                }
            }
        };
        requestAnimationFrame(animate);
    }
    
    // GUARANTEED completion
    function completeLoader() {
        if (isComplete) return;
        isComplete = true;
        
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.transition = 'opacity 0.4s ease-out';
            loader.style.opacity = '0';
            
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                unlockScroll();
            }, 400);
        } else {
            unlockScroll();
        }
    }
    
    // Initialize
    function init() {
        lockScroll();
        
        // Setup progress bar
        progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.strokeDasharray = circumference;
            progressBar.style.strokeDashoffset = circumference;
        }
        
        // Animate logo
        const loaderLogo = document.getElementById('loaderHeroLogo');
        if (loaderLogo) {
            setTimeout(() => loaderLogo.classList.add('animate-in'), 50);
        }
        
        // Progress sequence
        setTimeout(() => updateProgress(30), 200);
        setTimeout(() => updateProgress(60), 500);
        setTimeout(() => updateProgress(90), 800);
        setTimeout(() => updateProgress(100), 1100);
    }
    
    // Start immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // MULTIPLE FAILSAFES - CANNOT FAIL
    
    // Failsafe 1: Force complete after 2.5 seconds
    setTimeout(() => {
        if (!isComplete) {
            console.log('Loader failsafe activated');
            completeLoader();
        }
    }, 2500);
    
    // Failsafe 2: Emergency removal after 4 seconds
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader && loader.style.opacity !== '0') {
            loader.style.display = 'none';
            unlockScroll();
        }
    }, 4000);
    
    // Failsafe 3: Page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !isComplete) {
            setTimeout(completeLoader, 100);
        }
    });
    
})();