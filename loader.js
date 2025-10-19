// ULTRA-OPTIMIZED BUTTERY SMOOTH LOADER - MAXIMUM PERFORMANCE WITH PERFECT POSITIONING
(function() {
    'use strict';
    
    let progressValue = 0;
    let targetProgress = 0;
    let animationId;
    let hasStarted = false;
    let isComplete = false;
    let originalScrollPosition = 0;
    
    // High-performance variables
    let lastFrameTime = 0;
    let progressBar, progressRing, companyText, progressContainer;
    const circumference = 2 * Math.PI * 150;
    
    // Ultra-fast scroll prevention
    function preventScrolling() {
        originalScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        document.documentElement.classList.add('loading-active');
        document.body.classList.add('loading-active');
        document.body.style.top = `-${originalScrollPosition}px`;
        
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.addEventListener('keydown', preventScrollKeys, { passive: false });
    }
    
    function allowScrolling() {
        document.documentElement.classList.remove('loading-active');
        document.body.classList.remove('loading-active');
        document.body.style.top = '';
        window.scrollTo(0, originalScrollPosition);
        
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'auto';
        }
        
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('keydown', preventScrollKeys);
    }
    
    function preventScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    function preventScrollKeys(e) {
        const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
        if (scrollKeys.includes(e.keyCode)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    // PRECISE HERO POSITIONING - from original code
    function getHeroPosition() {
        const actualHeroLogo = document.querySelector('.hero-logo');
        if (actualHeroLogo) {
            const rect = actualHeroLogo.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop + (rect.height / 2),
                left: rect.left + (rect.width / 2)
            };
        }
        return {
            top: window.innerHeight / 2,
            left: window.innerWidth / 2
        };
    }
    
    // LIGHTNING-FAST progress animation with 60fps smoothness
    function updateProgressInstant(newTarget) {
        targetProgress = newTarget;
        
        if (!animationId) {
            animationId = requestAnimationFrame(ultraSmoothProgress);
        }
    }
    
    function ultraSmoothProgress(currentTime) {
        if (currentTime - lastFrameTime < 16.67) { // 60fps cap
            animationId = requestAnimationFrame(ultraSmoothProgress);
            return;
        }
        lastFrameTime = currentTime;
        
        // ULTRA-FAST interpolation - catches up in 8 frames max
        const diff = targetProgress - progressValue;
        const speed = Math.abs(diff) > 20 ? 0.25 : 0.15; // Faster for big jumps
        
        progressValue += diff * speed;
        
        // Lightning-fast progress bar update
        if (progressBar) {
            const offset = circumference - (progressValue / 100) * circumference;
            progressBar.style.strokeDashoffset = offset;
        }
        
        // Continue animation if not at target
        if (Math.abs(diff) > 0.1) {
            animationId = requestAnimationFrame(ultraSmoothProgress);
        } else {
            progressValue = targetProgress;
            animationId = null;
            
            // Trigger emissive instantly at 100%
            if (targetProgress >= 100) {
                triggerEmissiveInstant();
            }
        }
    }
    
    // Create dynamic lightning success effect
    function createSuccessLightning() {
        const lightning = document.createElement('div');
        lightning.className = 'success-lightning';
        lightning.innerHTML = `
            <div class="lightning-flash"></div>
            <div class="lightning-particles"></div>
            <div class="success-pulse"></div>
        `;
        if (progressContainer) {
            progressContainer.appendChild(lightning);
            setTimeout(() => lightning.classList.add('active'), 50);
        }
        return lightning;
    }
    
    // INSTANT emissive state activation with success effects
    function triggerEmissiveInstant() {
        if (!progressBar || !progressContainer) return;
        
        // Immediate emissive activation
        progressBar.classList.add('emissive', 'success-mode');
        progressContainer.classList.add('emissive', 'success-active');
        
        // Add success ring animation
        if (progressRing) {
            progressRing.classList.remove('animating');
            progressRing.classList.add('success-complete');
        }
        
        // Create lightning effect
        const lightning = createSuccessLightning();
        
        // Fast text reveal - starts immediately
        if (companyText) {
            companyText.style.animation = 'ultraFastReveal 600ms cubic-bezier(0.19, 1, 0.22, 1) forwards';
            companyText.style.opacity = '1';
            
            // Quick glow activation
            setTimeout(() => {
                companyText.classList.add('glow-active');
            }, 200);
        }
        
        // Fast exit sequence - much shorter duration
        setTimeout(() => {
            startFastExit();
            // Clean up lightning effect
            if (lightning && lightning.parentNode) {
                lightning.parentNode.removeChild(lightning);
            }
        }, 1500); // Reduced from 2800ms
    }
    
    // LIGHTNING-FAST exit sequence with perfect positioning
    function startFastExit() {
        // Instant text fade
        if (companyText) {
            companyText.classList.remove('glow-active');
            companyText.style.animation = 'ultraFastExit 400ms cubic-bezier(0.19, 1, 0.22, 1) forwards';
        }
        
        // Instant progress fade
        setTimeout(() => {
            if (progressBar && progressContainer) {
                progressBar.style.transition = 'opacity 300ms cubic-bezier(0.19, 1, 0.22, 1)';
                progressContainer.style.transition = 'opacity 300ms cubic-bezier(0.19, 1, 0.22, 1)';
                progressBar.style.opacity = '0';
                progressContainer.style.opacity = '0';
            }
        }, 100);
        
        // Fast completion
        setTimeout(() => {
            completeLoadingInstant();
        }, 300);
    }
    
    // INSTANT completion with precise hero positioning
    function completeLoadingInstant() {
        if (isComplete) return;
        isComplete = true;
        
        const loader = document.getElementById('loader');
        const loaderHeroLogo = document.getElementById('loaderHeroLogo');
        
        // PERFECT POSITIONING - Get hero position and apply precise scaling
        if (loaderHeroLogo) {
            const heroPos = getHeroPosition();
            
            // Apply the perfect positioning and scaling from original code
            loaderHeroLogo.style.top = heroPos.top + 'px';
            loaderHeroLogo.style.left = heroPos.left + 'px';
            loaderHeroLogo.style.transform = 'translate(-50%, -50%) scale(1.03)';
            loaderHeroLogo.style.transition = 'all 300ms cubic-bezier(0.19, 1, 0.22, 1)';
            loaderHeroLogo.classList.add('success-transition');
            loaderHeroLogo.classList.add('move-to-position');
        }
        
        // Instant final fade
        setTimeout(() => {
            if (loader) {
                loader.style.transition = 'opacity 600ms cubic-bezier(0.19, 1, 0.22, 1)';
                loader.classList.add('fade-out');
                
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                    allowScrolling();
                }, 600);
            }
        }, 150);
    }
    
    // OPTIMIZED initialization - cache elements immediately
    function initializeUltraFast() {
        preventScrolling();
        
        // Cache all elements for performance
        progressBar = document.querySelector('.progress-bar');
        progressRing = document.querySelector('.progress-ring');
        companyText = document.querySelector('.company-name-text');
        progressContainer = document.querySelector('.progress-container');
        const loaderHeroLogo = document.getElementById('loaderHeroLogo');
        
        // Setup progress bar for maximum performance
        if (progressBar) {
            progressBar.style.strokeDasharray = circumference;
            progressBar.style.strokeDashoffset = circumference;
            progressBar.style.willChange = 'stroke-dashoffset';
        }
        
        // Instant logo appearance
        if (loaderHeroLogo) {
            setTimeout(() => {
                loaderHeroLogo.style.transition = 'all 400ms cubic-bezier(0.19, 1, 0.22, 1)';
                loaderHeroLogo.classList.add('animate-in');
            }, 100);
        }
        
        // Start progress ring animation immediately
        if (progressRing) {
            hasStarted = true;
            progressRing.classList.add('animating');
            
            // Add vibrant mode for color cycling
            if (progressBar) {
                progressBar.classList.add('vibrant-mode');
            }
        }
        
        // Show company text during progress - faster timing
        setTimeout(() => {
            if (companyText) {
                companyText.style.animation = 'dramaticReveal 1.8s ease-out forwards';
            }
        }, 300);
        
        // AGGRESSIVE loading sequence - much faster progression
        const fastSteps = [
            { progress: 25, delay: 200 },
            { progress: 50, delay: 400 },
            { progress: 75, delay: 600 },
            { progress: 95, delay: 800 },
            { progress: 100, delay: 1000 }
        ];
        
        fastSteps.forEach(step => {
            setTimeout(() => {
                updateProgressInstant(step.progress);
            }, step.delay);
        });
    }
    
    // Preload effects for performance
    function preloadEffects() {
        const testEl = document.createElement('div');
        testEl.style.transform = 'translateZ(0)';
        testEl.style.willChange = 'transform, opacity';
    }
    
    // Initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            preloadEffects();
            initializeUltraFast();
        });
    } else {
        preloadEffects();
        initializeUltraFast();
    }
    
    // Emergency bailout - much shorter
    setTimeout(() => {
        if (!isComplete) {
            completeLoadingInstant();
        }
    }, 4000); // Reduced from 10000ms
    
    // Handle visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !isComplete) {
            setTimeout(completeLoadingInstant, 50);
        }
    });
    
})();