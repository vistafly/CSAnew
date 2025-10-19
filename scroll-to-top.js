// Force scroll to top on page load/reload
(function() {
    'use strict';
    
    // Immediate scroll to top - runs as soon as script loads
    window.scrollTo(0, 0);
    
    // Ensure we're at the top when DOM is ready
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        
        // Also set the document scroll position directly
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
    
    // Multiple triggers to ensure it works in all scenarios
    
    // 1. As soon as possible
    scrollToTop();
    
    // 2. When DOM content is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scrollToTop);
    } else {
        scrollToTop();
    }
    
    // 3. When window is fully loaded
    window.addEventListener('load', scrollToTop);
    
    // 4. Handle browser back/forward navigation
    window.addEventListener('pageshow', function(event) {
        scrollToTop();
    });
    
    // 5. Override any hash navigation on load
    if (window.location.hash) {
        // Remove hash from URL without triggering navigation
        history.replaceState(null, null, window.location.pathname + window.location.search);
        scrollToTop();
    }
    
    // 6. Prevent any automatic scrolling behavior from other scripts
    const originalScrollTo = window.scrollTo;
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    
    // Temporarily override scrolling functions during initial load
    let loadComplete = false;
    
    window.scrollTo = function(...args) {
        if (loadComplete) {
            originalScrollTo.apply(window, args);
        } else {
            originalScrollTo.call(window, 0, 0);
        }
    };
    
    Element.prototype.scrollIntoView = function(...args) {
        if (loadComplete) {
            originalScrollIntoView.apply(this, args);
        }
    };
    
    // Re-enable normal scrolling after everything is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadComplete = true;
            window.scrollTo = originalScrollTo;
            Element.prototype.scrollIntoView = originalScrollIntoView;
        }, 100);
    });
    
    // 7. Handle cases where CSS might cause auto-scrolling
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: auto !important;
        }
        body {
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(style);
    
    // Remove the override after initial load
    window.addEventListener('load', function() {
        setTimeout(() => {
            style.remove();
            // Restore smooth scrolling
            document.documentElement.style.scrollBehavior = 'smooth';
        }, 200);
    });
    
})();