/**
 * SIMPLE SCROLL EFFECTS - DRAMATIC VERSION
 * More noticeable animations
 */

(function() {
    'use strict';
    
    console.log('🎬 DRAMATIC scroll effects loaded!');
    
    function init() {
        const header = document.getElementById('header');
        const sections = document.querySelectorAll('section[id]');
        
        const fadeElements = [];
        
        // Add fade-in to sections (except hero)
        sections.forEach((section, index) => {
            if (section.id !== 'home' && section.id !== '') {
                section.classList.add('fade-in-on-scroll');
                section.style.transitionDelay = `${index * 0.15}s`;
                fadeElements.push(section);
                console.log('✨ Section ready:', section.id);
            }
        });
        
        // Add fade-in to cards with stagger
        const cards = document.querySelectorAll('.program-card, .testimonial-card, .stat-item, .gallery-item');
        cards.forEach((card, index) => {
            card.classList.add('fade-in-on-scroll');
            card.style.transitionDelay = `${index * 0.08}s`;
            fadeElements.push(card);
        });
        
        console.log('🎯 Tracking', fadeElements.length, 'elements');
        
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Trigger when 20% visible (earlier trigger)
            return rect.top < windowHeight * 0.8;
        }
        
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    
                    // Update header with hysteresis to prevent flickering
                    if (header) {
                        const isScrolled = header.classList.contains('scrolled');
                        if (!isScrolled && scrollY > 50) {
                            header.classList.add('scrolled');
                        } else if (isScrolled && scrollY < 30) {
                            header.classList.remove('scrolled');
                        }
                        
                        if (window.innerWidth <= 768) {
                            if (scrollY > lastScrollY && scrollY > 100) {
                                header.classList.add('header-hidden');
                            } else {
                                header.classList.remove('header-hidden');
                            }
                        } else {
                            header.classList.remove('header-hidden');
                        }
                    }
                    
                    // Check fade-in elements
                    const newlyVisible = [];
                    fadeElements.forEach(element => {
                        if (!element.classList.contains('visible')) {
                            if (isInViewport(element)) {
                                element.classList.add('visible');
                                newlyVisible.push(element);
                            }
                        }
                    });
                    
                    if (newlyVisible.length > 0) {
                        console.log(`🌟 FADING IN ${newlyVisible.length} elements:`, 
                            newlyVisible.map(el => el.tagName + (el.id ? '#' + el.id : '')));
                    }
                    
                    lastScrollY = scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        setTimeout(() => {
            onScroll();
            console.log('✅ Scroll effects ready! Scroll down to see animations.');
        }, 100);
        
        window.scrollEffects = {
            status: () => {
                const visible = fadeElements.filter(el => el.classList.contains('visible')).length;
                console.log(`📊 ${visible}/${fadeElements.length} elements visible`);
            },
            showAll: () => {
                fadeElements.forEach(el => el.classList.add('visible'));
                console.log('💫 Revealed all elements!');
            },
            hideAll: () => {
                fadeElements.forEach(el => el.classList.remove('visible'));
                console.log('👻 Hidden all elements!');
            },
            testAnimation: () => {
                console.log('🎬 Testing animation...');
                scrollEffects.hideAll();
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 500);
                setTimeout(() => {
                    console.log('📜 Now scroll down slowly to see the effect!');
                }, 1500);
            }
        };
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();