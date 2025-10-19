// MINIMAL PARALLAX ANIMATION - FIXED JITTER ISSUE
// Copy this entire code and paste it into a NEW FILE called "parallax.js"
// Then add <script src="parallax.js"></script> before the closing </body> tag in your HTML

(function() {
    'use strict';
    
    let stickyApplied = false;
    let isNavigatingHome = false;
    
    function startParallax() {
        console.log('Starting parallax animation...');
        
        const hero = document.getElementById('home');
        const programs = document.getElementById('programs');
        
        if (!hero) {
            console.error('Hero section with ID "home" not found');
            return;
        }
        
        if (!programs) {
            console.error('Programs section with ID "programs" not found');
            return;
        }
        
        console.log('Elements found, setting up parallax...');
        
        // Set initial hero positioning - start as sticky to prevent jitter
        hero.style.position = 'sticky';
        hero.style.top = '0';
        hero.style.zIndex = '1';
        stickyApplied = true;
        
        // Ensure programs section overlays properly
        programs.style.position = 'relative';
        programs.style.zIndex = '10';
        programs.style.backgroundColor = '#f8f9fa';
        programs.style.borderRadius = '24px 24px 0 0';
        programs.style.boxShadow = '0 -20px 40px rgba(0, 0, 0, 0.1)';
        programs.style.marginTop = '-1px';
        
        // Ensure all sections after programs are visible
        const sectionsAfterPrograms = ['gallery', 'about', 'testimonials', 'contact'];
        sectionsAfterPrograms.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.position = 'relative';
                section.style.zIndex = '10';
            }
        });
        
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.position = 'relative';
            footer.style.zIndex = '10';
        }
        
        function resetHeroToNormal() {
            hero.style.position = 'relative';
            hero.style.top = '';
            hero.style.zIndex = '';
            stickyApplied = false;
            
            // Reset all parallax effects
            const elementsToReset = [
                hero.querySelector('.hero-content'),
                hero.querySelector('.hero-video'),
                hero.querySelector('.hero-logo'),
                hero.querySelector('.hero-actions'),
                hero.querySelector('.hero-text-container'),
                hero.querySelector('.scroll-indicator'),
                hero.querySelector('.hero-overlay')
            ];
            
            elementsToReset.forEach(element => {
                if (element) {
                    element.style.opacity = '';
                    element.style.transform = '';
                    element.style.filter = '';
                    element.style.backgroundColor = '';
                    element.style.transition = '';
                }
            });
        }
        
        function applyParallax() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Don't do anything if we're navigating home
            if (isNavigatingHome) {
                return;
            }
            
            // Only reset to relative when at the very top (prevents jitter)
            if (scrollY <= 2 && stickyApplied) {
                hero.style.position = 'relative';
                hero.style.top = '';
                stickyApplied = false;
                console.log('At top - reset to relative positioning');
                return;
            }
            
            // Apply sticky positioning when scrolling (but prevent re-applying if already sticky)
            if (scrollY > 2 && !stickyApplied) {
                hero.style.position = 'sticky';
                hero.style.top = '0';
                hero.style.zIndex = '1';
                stickyApplied = true;
                console.log('Sticky positioning applied at scroll:', scrollY);
            }
            
            // Apply parallax effects only if sticky is active and we have some scroll
            if (stickyApplied && scrollY > 10) {
                const startTrigger = windowHeight * 0.1;
                const endTrigger = windowHeight * 1.2;
                const progress = Math.max(0, Math.min(1, (scrollY - startTrigger) / (endTrigger - startTrigger)));
                const easedProgress = easeOutCubic(progress);
                
                if (progress > 0) {
                    // Apply effects to all hero elements - NO MOVEMENT, only fade and scale
                    const heroContent = hero.querySelector('.hero-content');
                    const heroVideo = hero.querySelector('.hero-video');
                    const heroLogo = hero.querySelector('.hero-logo');
                    const heroActions = hero.querySelector('.hero-actions');
                    const heroTextContainer = hero.querySelector('.hero-text-container');
                    const scrollIndicator = hero.querySelector('.scroll-indicator');
                    const heroOverlay = hero.querySelector('.hero-overlay');
                    
                    if (heroContent) {
                        // Don't apply opacity to preserve child backdrop-filter effects
                        const scale = 1 - (easedProgress * 0.02);
                        heroContent.style.transform = `scale(${scale})`;
                        heroContent.style.transition = 'none';
                    }
                    
                    if (heroVideo) {
                        const scale = 1 + (easedProgress * 0.03);
                        const opacity = 1 - (easedProgress * 0.3);
                        heroVideo.style.transform = `scale(${scale})`;
                        heroVideo.style.opacity = opacity;
                        heroVideo.style.transition = 'none';
                    }
                    
                    if (heroLogo) {
                        const opacity = 1 - easedProgress;
                        const scale = 1 - (easedProgress * 0.03);
                        heroLogo.style.opacity = opacity;
                        heroLogo.style.transform = `scale(${scale})`;
                        heroLogo.style.transition = 'none';
                    }
                    
                    if (heroActions) {
                        const opacity = 1 - easedProgress;
                        const scale = 1 - (easedProgress * 0.02);
                        heroActions.style.opacity = opacity;
                        heroActions.style.transform = `scale(${scale})`;
                        heroActions.style.transition = 'none';
                    }
                    
                    if (heroTextContainer) {
                        // Don't apply opacity to preserve backdrop-filter blur effect
                        const scale = 1 - (easedProgress * 0.01);
                        heroTextContainer.style.transform = `scale(${scale})`;
                        heroTextContainer.style.transition = 'none';
                    }
                    
                    if (scrollIndicator) {
                        const opacity = 1 - (easedProgress * 1.5);
                        const scale = 1 - (easedProgress * 0.05);
                        scrollIndicator.style.opacity = Math.max(0, opacity);
                        scrollIndicator.style.transform = `translateX(-50%) scale(${scale})`;
                        scrollIndicator.style.transition = 'none';
                    }
                    
                    if (heroOverlay) {
                        const overlayOpacity = 0.5 + (easedProgress * 0.3);
                        heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${overlayOpacity})`;
                        heroOverlay.style.transition = 'none';
                    }
                }
            }
        }
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        let ticking = false;
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    applyParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Handle Home navigation specially
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('a[href^="#"]');
            if (navLink) {
                const targetId = navLink.getAttribute('href');
                
                if (targetId === '#home') {
                    console.log('Home navigation clicked');
                    isNavigatingHome = true;
                    
                    // Immediately reset everything
                    resetHeroToNormal();
                    
                    // Override the smooth scroll behavior for home
                    e.preventDefault();
                    
                    // Scroll to top immediately
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    // Re-enable parallax after scroll completes
                    setTimeout(() => {
                        isNavigatingHome = false;
                        console.log('Home navigation complete - parallax re-enabled');
                        // Force immediate check
                        applyParallax();
                    }, 1000);
                }
            }
        });
        
        // Initial call
        applyParallax();
        
        console.log('Parallax animation setup complete');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startParallax);
    } else {
        startParallax();
    }
    
    // Backup initialization
    setTimeout(startParallax, 1000);
    
})();