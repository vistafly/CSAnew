// Safe scroll to top - NEVER interferes with other scripts
(function() {
    'use strict';
    
    function forceScrollTop() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
    
    // Immediate scroll
    forceScrollTop();
    
    // Handle different load states
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceScrollTop);
    }
    
    // Handle browser navigation
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            forceScrollTop();
        }
    });
    
    // Remove hash if present
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
        forceScrollTop();
    }
    
})();