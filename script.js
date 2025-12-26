// script.js - COMPLETE VERSION WITH MOBILE SCROLL FIX
// Clean Program Filtering System
class ProgramFilter {
    constructor() {
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.specPills = document.querySelectorAll('.spec-pill');
        this.clearButton = document.getElementById('clearFilters');
        this.programCount = document.getElementById('programCount');
        this.programsGrid = document.querySelector('.programs-grid');
        this.allPrograms = [];
        this.currentCategory = 'all';
        this.currentSubcategory = 'all';
        this.isFiltering = false; // Prevent recursive filtering
        
        this.init();
    }
    
    init() {
        this.allPrograms = Array.from(document.querySelectorAll('.program-card'));
        
        console.log('Found elements:', {
            categoryTabs: this.categoryTabs.length,
            specPills: this.specPills.length,
            clearButton: !!this.clearButton,
            programCount: !!this.programCount,
            programsGrid: !!this.programsGrid,
            allPrograms: this.allPrograms.length
        });
        
        if (!this.categoryTabs.length || !this.specPills.length) {
            console.log('Program filters not found on this page');
            return;
        }
        
        // Add event listeners with debugging
        this.categoryTabs.forEach((tab, index) => {
            console.log(`Adding listener to category tab ${index}:`, tab.dataset.category);
            tab.addEventListener('click', (e) => {
                console.log('Category tab clicked:', tab.dataset.category);
                this.setCategory(tab.dataset.category);
            });
        });
        
        this.specPills.forEach((pill, index) => {
            console.log(`Adding listener to spec pill ${index}:`, pill.dataset.subcategory);
            pill.addEventListener('click', (e) => {
                console.log('Spec pill clicked:', pill.dataset.subcategory);
                this.setSubcategory(pill.dataset.subcategory);
            });
        });
        
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                console.log('Clear button clicked');
                this.clearAllFilters();
            });
        }
        
        this.createEmptyState();
        this.updateCount();
        this.updateClearButton();
        
        console.log(`Program filtering initialized successfully with ${this.allPrograms.length} programs`);
    }
    
    setCategory(category) {
        console.log('Setting category to:', category);
        this.currentCategory = category;
        
        // Update active states
        this.categoryTabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        this.filterPrograms();
    }
    
    setSubcategory(subcategory) {
        console.log('Setting subcategory to:', subcategory);
        this.currentSubcategory = subcategory;
        
        // Update active states
        this.specPills.forEach(pill => {
            if (pill.dataset.subcategory === subcategory) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
        
        this.filterPrograms();
    }
    
    filterPrograms() {
        // CRITICAL FIX: Prevent recursive calls
        if (this.isFiltering) {
            return;
        }
        
        this.isFiltering = true;
        
        console.log('Filtering programs with:', {
            category: this.currentCategory,
            subcategory: this.currentSubcategory
        });
        
        if (this.programsGrid) {
            this.programsGrid.classList.add('loading');
        }
        
        let visibleCount = 0;
        
        this.allPrograms.forEach(program => {
            const categories = (program.dataset.category || '').split(',').map(cat => cat.trim());
            const subcategory = program.dataset.subcategory || '';
            
            const categoryMatch = this.currentCategory === 'all' || 
                                categories.includes(this.currentCategory);
            const subcategoryMatch = this.currentSubcategory === 'all' || 
                                   subcategory === this.currentSubcategory;
            
            if (categoryMatch && subcategoryMatch) {
                program.classList.remove('hidden');
                visibleCount++;
            } else {
                program.classList.add('hidden');
            }
        });
        
        console.log(`Filtered results: ${visibleCount} visible programs`);
        
        setTimeout(() => {
            if (this.programsGrid) {
                this.programsGrid.classList.remove('loading');
            }
            this.updateCount(visibleCount);
            this.toggleEmptyState(visibleCount === 0);
            this.updateClearButton();
            
            // CRITICAL: Reset flag after everything is done
            setTimeout(() => {
                this.isFiltering = false;
            }, 100);
        }, 300);
    }
    
    clearAllFilters() {
        console.log('Clearing all filters');
        this.currentCategory = 'all';
        this.currentSubcategory = 'all';
        
        // Reset UI
        this.categoryTabs.forEach(tab => {
            if (tab.dataset.category === 'all') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        this.specPills.forEach(pill => {
            if (pill.dataset.subcategory === 'all') {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
        
        // Show all programs
        this.allPrograms.forEach(program => {
            program.classList.remove('hidden');
        });
        
        this.updateCount(this.allPrograms.length);
        this.toggleEmptyState(false);
        this.updateClearButton();
    }
    
    updateCount(count = null) {
        if (!this.programCount) return;
        
        const displayCount = count !== null ? count : this.allPrograms.length;
        this.programCount.textContent = displayCount;
    }
    
    updateClearButton() {
        if (!this.clearButton) return;
        
        const hasFilters = this.currentCategory !== 'all' || this.currentSubcategory !== 'all';
        
        if (hasFilters) {
            this.clearButton.classList.add('show');
            this.clearButton.style.display = 'inline-block';
        } else {
            this.clearButton.classList.remove('show');
            this.clearButton.style.display = 'none';
        }
    }
    
    createEmptyState() {
        if (!document.querySelector('.programs-empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'programs-empty-state';
            emptyState.innerHTML = `
                <h3>No programs found</h3>
                <p>Try adjusting your selection or clear filters to see all programs.</p>
                <button class="btn" onclick="programFilter.clearAllFilters()">Show All Programs</button>
            `;
            
            if (this.programsGrid) {
                this.programsGrid.insertAdjacentElement('afterend', emptyState);
            }
        }
    }
    
    toggleEmptyState(show) {
        const emptyState = document.querySelector('.programs-empty-state');
        if (emptyState) {
            if (show) {
                emptyState.classList.add('show');
                if (this.programsGrid) {
                    this.programsGrid.style.display = 'none';
                }
            } else {
                emptyState.classList.remove('show');
                if (this.programsGrid) {
                    this.programsGrid.style.display = 'grid';
                }
            }
        }
    }
    
    // Public methods
    setFilters(category = 'all', subcategory = 'all') {
        this.setCategory(category);
        this.setSubcategory(subcategory);
    }
    
    getCurrentFilters() {
        return {
            category: this.currentCategory,
            subcategory: this.currentSubcategory
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing program filter...');
    window.programFilter = new ProgramFilter();
});

// Fallback initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.programFilter) {
            console.log('Fallback: Initializing program filter...');
            window.programFilter = new ProgramFilter();
        }
    });
} else {
    // DOM is already loaded
    console.log('DOM already loaded, initializing program filter immediately...');
    if (!window.programFilter) {
        window.programFilter = new ProgramFilter();
    }
}

// Enhanced program card interactions - only active when authenticated
document.addEventListener('DOMContentLoaded', () => {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('hidden')) return;
            
            // ONLY handle clicks if user is authenticated
            // If not authenticated, do nothing - just let CSS hover effects work
            if (typeof currentUser !== 'undefined' && currentUser) {
                const program = this.dataset.subcategory;
                const title = this.querySelector('.program-title')?.textContent;
                
                console.log('Program clicked:', title);
                
                // Apply filter to gallery if it exists
                const programFilter = document.getElementById('programFilter');
                if (programFilter) {
                    programFilter.value = program || 'all';
                    
                    // Trigger the change event to update the gallery
                    const changeEvent = new Event('change', { bubbles: true });
                    programFilter.dispatchEvent(changeEvent);
                    
                    // Also call filterGallery directly as backup
                    if (typeof filterGallery === 'function') {
                        filterGallery();
                    }
                }
                
                // Scroll to gallery with a small delay to ensure filtering completes
                const gallery = document.getElementById('gallery');
                if (gallery) {
                    setTimeout(() => {
                        gallery.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
            // Not authenticated: no action, no modal, no notification - hover effects only
        });
    });
});

// Debug function to check if everything is working
window.debugFilters = function() {
    console.log('=== DEBUG FILTERS ===');
    console.log('Category tabs found:', document.querySelectorAll('.category-tab').length);
    console.log('Spec pills found:', document.querySelectorAll('.spec-pill').length);
    console.log('Clear button found:', !!document.getElementById('clearFilters'));
    console.log('Program count element found:', !!document.getElementById('programCount'));
    console.log('Programs grid found:', !!document.querySelector('.programs-grid'));
    console.log('Program cards found:', document.querySelectorAll('.program-card').length);
    console.log('Program filter instance:', !!window.programFilter);
    console.log('Horizontal Scroll Manager:', !!window.horizontalScrollManager);
    
    if (window.programFilter) {
        console.log('Current filters:', window.programFilter.getCurrentFilters());
    }
    
    if (window.horizontalScrollManager) {
        console.log('Scroll Mode:', window.horizontalScrollManager.getCurrentMode());
        console.log('Visible cards:', window.horizontalScrollManager.getVisibleCardCount());
    }
};

// Export for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgramFilter };
}

/**
 * PROFESSIONAL HORIZONTAL SCROLL MANAGER - MOBILE SCROLL FIX
 * High-end animations, bulletproof functionality, responsive design
 * FIXED: Now properly calculates actual card widths for mobile scrolling
 */

class FixedHorizontalScrollManager {
    constructor() {
        // Core DOM elements
        this.programsGrid = document.getElementById('programsGrid');
        this.scrollLeftBtn = document.getElementById('scrollLeft');
        this.scrollRightBtn = document.getElementById('scrollRight');
        this.viewToggle = document.getElementById('viewToggle');
        this.scrollControls = document.getElementById('scrollControls');
        this.filterResults = document.querySelector('.filter-results');
        this.programCount = document.getElementById('programCount');
        
        // State management
        this.isScrollMode = false;
        this.isTransitioning = false;
        this.isManualToggle = false;
        this.scrollThreshold = 3;
        this.isCheckingLayout = false; // Prevent recursive layout checks
        
        // Performance optimization
        this.scrollTimeout = null;
        this.resizeTimeout = null;
        this.filterTimeout = null;
        
        this.init();
    }
    
    init() {
        if (!this.programsGrid) {
            console.error('❌ Programs grid not found');
            return;
        }
        
        console.log('🚀 Fixed Horizontal Scroll Manager initialized');
        
        this.createScrollProgress();
        this.setupEventListeners();
        this.forceGridLayout();
        
        // ALWAYS show scroll controls
        if (this.scrollControls) {
            this.scrollControls.style.display = 'flex';
            this.scrollControls.style.visibility = 'visible';
        }
        
        this.checkScrollNeed();
        this.updateViewToggleState();
    }
    
    // CRITICAL: Force proper grid layout
    forceGridLayout() {
        if (!this.programsGrid) return;
        
        // Remove any conflicting classes
        this.programsGrid.classList.remove('horizontal-scroll');
        
        // Force grid properties
        this.programsGrid.style.display = 'grid';
        this.programsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        this.programsGrid.style.gap = '25px';
        this.programsGrid.style.justifyItems = 'center';
        this.programsGrid.style.overflow = 'visible';
        
        // Remove flex properties
        this.programsGrid.style.flexDirection = '';
        this.programsGrid.style.flexWrap = '';
        this.programsGrid.style.justifyContent = '';
        
        console.log('✅ Grid layout enforced');
    }
    
    createScrollProgress() {
        if (!this.scrollControls) return;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        
        progressContainer.appendChild(progressBar);
        
        // Insert between scroll buttons
        const rightBtn = this.scrollRightBtn;
        if (rightBtn && rightBtn.parentNode) {
            rightBtn.parentNode.insertBefore(progressContainer, rightBtn);
        }
        
        this.progressBar = progressBar;
    }
    
    setupEventListeners() {
        // Scroll button events
        if (this.scrollLeftBtn) {
            this.scrollLeftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollLeft();
            });
        }
        
        if (this.scrollRightBtn) {
            this.scrollRightBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollRight();
            });
        }
        
        // View toggle
        if (this.viewToggle) {
            this.viewToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleScrollMode();
            });
        }
        
        // Grid scroll events
        if (this.programsGrid) {
            this.programsGrid.addEventListener('scroll', () => {
                this.handleScroll();
            }, { passive: true });
            
            // Keyboard navigation
            this.programsGrid.addEventListener('keydown', (e) => {
                if (!this.isScrollMode) return;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.scrollLeft();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.scrollRight();
                        break;
                }
            });
        }
        
        // Optimized resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        }, { passive: true });
    }
    
    checkScrollNeed() {
    // CRITICAL FIX: Prevent recursive calls
    if (this.isTransitioning || this.isCheckingLayout) return;
    
    this.isCheckingLayout = true;
    
    const visibleCards = this.getVisibleCards();
    
    console.log(`📊 Scroll check: ${visibleCards.length} cards`);
    
    // CRITICAL: Once scroll mode is enabled, NEVER auto-disable it during filtering
    // Only enable scroll mode if we're not already in it
    if (!this.isScrollMode && !this.isManualToggle) {
        this.enableScrollMode();
    }
    
    this.updateCardCount(visibleCards.length);
    
    // Reset flag after a delay
    setTimeout(() => {
        this.isCheckingLayout = false;
    }, 200);
}
    
    getVisibleCards() {
        return Array.from(this.programsGrid.querySelectorAll('.program-card:not(.hidden):not([style*="display: none"]):not([style*="visibility: hidden"])'));
    }
    
    // MOBILE FIX: Get actual card width from DOM
    getCardWidth() {
        const firstCard = this.programsGrid.querySelector('.program-card:not(.hidden)');
        if (firstCard) {
            const width = firstCard.offsetWidth;
            console.log('📏 Actual card width from DOM:', width);
            return width;
        }
        
        // Fallback to estimated widths
        const isMobile = window.innerWidth <= 768;
        const fallbackWidth = isMobile ? 280 : 300;
        console.log('📏 Using fallback card width:', fallbackWidth);
        return fallbackWidth;
    }
    
    // MOBILE FIX: Get actual gap from computed styles
    getGapSize() {
        if (this.programsGrid) {
            const computedStyle = window.getComputedStyle(this.programsGrid);
            const gap = computedStyle.gap || computedStyle.columnGap;
            
            if (gap && gap !== 'normal') {
                const gapValue = parseFloat(gap);
                console.log('📏 Actual gap from CSS:', gapValue);
                return gapValue;
            }
        }
        
        // Fallback to estimated gaps
        const isMobile = window.innerWidth <= 768;
        const fallbackGap = isMobile ? 16 : 24;
        console.log('📏 Using fallback gap:', fallbackGap);
        return fallbackGap;
    }
    
    enableScrollMode() {
    if (this.isScrollMode || this.isTransitioning) return;
    
    console.log('🔄 Enabling horizontal scroll mode...');
    
    this.isTransitioning = true;
    this.isScrollMode = true;

    // Remove grid properties
    this.programsGrid.style.gridTemplateColumns = '';
    this.programsGrid.style.justifyItems = '';
    this.programsGrid.style.display = ''; // Clear display to let class control it
    
    // Add scroll class - this applies all horizontal scroll styles
    this.programsGrid.classList.add('horizontal-scroll');
        
        // Show controls and ENABLE buttons by default
        if (this.scrollControls) {
            this.scrollControls.classList.add('active');
            this.scrollControls.style.display = 'flex';
            this.scrollControls.style.visibility = 'visible';
            this.scrollControls.style.opacity = '1';
        }
        
        // Enable buttons by default
        if (this.scrollLeftBtn) {
            this.scrollLeftBtn.disabled = false;
            this.scrollLeftBtn.style.opacity = '1';
        }
        if (this.scrollRightBtn) {
            this.scrollRightBtn.disabled = false;
            this.scrollRightBtn.style.opacity = '1';
        }
        
        if (this.filterResults) {
            this.filterResults.classList.add('scroll-active');
        }
        
        setTimeout(() => {
            this.updateViewToggleState();
            this.isTransitioning = false;
            
            console.log('✅ Scroll mode enabled successfully');
            
            // Update buttons AFTER layout has settled
            setTimeout(() => {
                this.updateScrollButtons();
                this.updateScrollProgress();
            }, 300);
        }, 100);
    }
    
    disableScrollMode() {
        if (!this.isScrollMode || this.isTransitioning) return;
        
        console.log('🔄 Disabling horizontal scroll mode...');
        
        this.isTransitioning = true;
        this.isScrollMode = false;
        
        // Remove scroll class
        this.programsGrid.classList.remove('horizontal-scroll');
        
        // Force grid layout
        this.forceGridLayout();
        
        // Hide controls
        if (this.scrollControls) {
            this.scrollControls.classList.remove('active');
        }
        
        if (this.filterResults) {
            this.filterResults.classList.remove('scroll-active');
        }
        
        setTimeout(() => {
            this.updateViewToggleState();
            this.isTransitioning = false;
            console.log('✅ Grid mode enabled successfully');
        }, 100);
    }
    
    toggleScrollMode() {
        if (this.isTransitioning) return;
        
        console.log('🔄 Manual scroll mode toggle');
        
        this.isManualToggle = true;
        
        if (this.isScrollMode) {
            this.disableScrollMode();
        } else {
            this.enableScrollMode();
        }
        
        // Reset manual toggle after delay
        setTimeout(() => {
            this.isManualToggle = false;
        }, 3000);
    }
    
    // MOBILE FIXED: Get actual card width + gap for accurate scrolling
    getScrollAmount() {
        const firstCard = this.programsGrid.querySelector('.program-card:not(.hidden)');
        
        if (firstCard) {
            // Get actual rendered card width
            const cardWidth = firstCard.offsetWidth;
            const gap = this.getGapSize();
            const scrollAmount = cardWidth + gap;
            
            console.log(`📏 Mobile scroll amount: ${cardWidth}px card + ${gap}px gap = ${scrollAmount}px`);
            
            return scrollAmount;
        }
        
        // Fallback calculation
        const fallbackAmount = this.getCardWidth() + this.getGapSize();
        console.log(`📏 Fallback scroll amount: ${fallbackAmount}px`);
        return fallbackAmount;
    }
    
    scrollLeft() {
        if (!this.isScrollMode || !this.programsGrid) return;
        
        const scrollAmount = this.getScrollAmount();
        
        this.programsGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        
        console.log('⬅️ Scrolling left by', scrollAmount, 'px');
    }
    
    scrollRight() {
        if (!this.isScrollMode || !this.programsGrid) return;
        
        const scrollAmount = this.getScrollAmount();
        
        this.programsGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        console.log('➡️ Scrolling right by', scrollAmount, 'px');
    }
    
    handleScroll() {
        if (!this.isScrollMode) return;
        
        // Throttle scroll events for performance
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            this.updateScrollButtons();
            this.updateScrollProgress();
        }, 16); // ~60fps
    }
    
    updateScrollButtons() {
        if (!this.isScrollMode || !this.programsGrid) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = this.programsGrid;
        const maxScroll = scrollWidth - clientWidth;
        
        const isAtStart = scrollLeft <= 5;
        const isAtEnd = scrollLeft >= (maxScroll - 5);
        
        // Update left button
        if (this.scrollLeftBtn) {
            this.scrollLeftBtn.disabled = isAtStart;
            this.scrollLeftBtn.style.opacity = isAtStart ? '0.5' : '1';
        }
        
        // Update right button
        if (this.scrollRightBtn) {
            this.scrollRightBtn.disabled = isAtEnd;
            this.scrollRightBtn.style.opacity = isAtEnd ? '0.5' : '1';
        }
    }
    
    updateScrollProgress() {
        if (!this.progressBar || !this.isScrollMode) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = this.programsGrid;
        const maxScroll = scrollWidth - clientWidth;
        
        if (maxScroll <= 0) {
            this.progressBar.style.width = '100%';
            return;
        }
        
        const progress = (scrollLeft / maxScroll) * 100;
        const clampedProgress = Math.min(100, Math.max(0, progress));
        
        this.progressBar.style.width = `${clampedProgress}%`;
    }
    
    updateViewToggleState() {
        if (!this.viewToggle) return;
        
        const icon = this.viewToggle.querySelector('.toggle-icon');
        if (icon) {
            if (this.isScrollMode) {
                // List/horizontal scroll mode - show grid icon to switch back
                icon.textContent = '⊞';
                icon.className = 'toggle-icon grid-mode';
                this.viewToggle.title = 'Switch to Grid View (Multiple Rows)';
            } else {
                // Grid mode - show horizontal lines to switch to scroll
                icon.textContent = '☰';
                icon.className = 'toggle-icon list-mode';
                this.viewToggle.title = 'Switch to Scroll View (Single Row)';
            }
        }
    }
    
    updateCardCount(count) {
        if (this.programCount) {
            this.programCount.textContent = count;
        }
    }
    
    handleResize() {
        // Debounce resize events
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            console.log('📐 Window resized, rechecking scroll need');
            if (!this.isScrollMode) {
                this.forceGridLayout(); // Ensure grid layout is maintained
            }
            this.checkScrollNeed();
            
            if (this.isScrollMode) {
                this.updateScrollButtons();
                this.updateScrollProgress();
            }
        }, 250);
    }
    
    // CRITICAL: Handle filtering properly with better debouncing
handleFilterChange() {
    if (this.isCheckingLayout) {
        return;
    }
    
    if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
    }
    
    this.filterTimeout = setTimeout(() => {
        console.log('🔍 Filter change detected, maintaining scroll mode...');
        
        const visibleCards = this.getVisibleCards();
        
        // CRITICAL: ALWAYS maintain scroll mode during filtering
        if (this.isScrollMode) {
            // Just update counts and buttons, DON'T check if we should switch modes
            this.updateCardCount(visibleCards.length);
            this.updateScrollButtons();
            this.updateScrollProgress();
        } else {
            // In grid mode, just update count
            this.updateCardCount(visibleCards.length);
        }
    }, 200);
}
    
    // Observer for DOM changes (filter updates) - WITH BETTER FILTERING
    observeGridChanges() {
        if (!this.programsGrid) return;
        
        let observerTimeout = null;
        
        const observer = new MutationObserver((mutations) => {
            // Clear existing timeout
            if (observerTimeout) {
                clearTimeout(observerTimeout);
            }
            
            // Debounce the mutation observations
            observerTimeout = setTimeout(() => {
                let shouldCheck = false;
                
                mutations.forEach(mutation => {
                    // Only respond to specific changes that matter
                    if (mutation.type === 'attributes') {
                        const attr = mutation.attributeName;
                        if (attr === 'class' && mutation.target.classList.contains('program-card')) {
                            // Only care about cards being hidden/shown
                            shouldCheck = true;
                        }
                    }
                });
                
                if (shouldCheck) {
                    this.handleFilterChange();
                }
            }, 300); // Debounce mutations
        });
        
        observer.observe(this.programsGrid, {
            childList: false, // Don't watch for added/removed children
            subtree: true,
            attributes: true,
            attributeFilter: ['class'], // Only watch class changes
            attributeOldValue: true // Track old values to compare
        });
        
        return observer;
    }
    
    // Public API methods
    getCurrentMode() {
        return this.isScrollMode ? 'scroll' : 'grid';
    }
    
    getVisibleCardCount() {
        return this.getVisibleCards().length;
    }
}

// Professional initialization with error handling
function initializeFixedHorizontalScrollManager() {
    try {
        console.log('🎬 Initializing Fixed Horizontal Scroll Manager...');
        
        // Wait for grid to be available
        const checkGrid = () => {
            const grid = document.getElementById('programsGrid');
            if (grid) {
                window.horizontalScrollManager = new FixedHorizontalScrollManager();
                
                // Start observing changes
                window.horizontalScrollManager.observeGridChanges();
                
                console.log('✅ Fixed Horizontal Scroll Manager ready');
                return true;
            }
            return false;
        };
        
        if (!checkGrid()) {
            // Retry with timeout
            const retryInterval = setInterval(() => {
                if (checkGrid()) {
                    clearInterval(retryInterval);
                }
            }, 100);
            
            // Stop retrying after 5 seconds
            setTimeout(() => {
                clearInterval(retryInterval);
                console.warn('⚠️ Could not find programs grid after 5 seconds');
            }, 5000);
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize horizontal scroll manager:', error);
    }
}

// CRITICAL: Enhanced integration with existing filter system
function integrateWithFilterSystem() {
    if (window.programFilter && window.horizontalScrollManager) {
        const originalFilterPrograms = window.programFilter.filterPrograms.bind(window.programFilter);
        
        window.programFilter.filterPrograms = function() {
            console.log('🔍 Filtering programs with grid protection...');
            
            const grid = document.getElementById('programsGrid');
            
            // CRITICAL: Ensure grid layout before filtering
            if (grid && !window.horizontalScrollManager.isScrollMode) {
                window.horizontalScrollManager.forceGridLayout();
            }
            
            // Execute original filter
            originalFilterPrograms();
            
            // Update scroll manager after filtering (with longer delay)
            setTimeout(() => {
                if (window.horizontalScrollManager) {
                    window.horizontalScrollManager.handleFilterChange();
                }
            }, 600); // Increased from 50ms to 600ms to avoid rapid firing
        };
        
        console.log('🔗 Enhanced filter system integration complete');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeFixedHorizontalScrollManager();
        setTimeout(integrateWithFilterSystem, 500);
    });
} else {
    initializeFixedHorizontalScrollManager();
    setTimeout(integrateWithFilterSystem, 500);
}

// Backup initialization
setTimeout(() => {
    if (!window.horizontalScrollManager) {
        console.log('🔄 Backup initialization triggered');
        initializeFixedHorizontalScrollManager();
        setTimeout(integrateWithFilterSystem, 200);
    }
}, 1000);

// Export for debugging
window.debugHorizontalScroll = () => {
    if (window.horizontalScrollManager) {
        console.log('🔍 Horizontal Scroll Debug Info:');
        console.log('Mode:', window.horizontalScrollManager.getCurrentMode());
        console.log('Visible cards:', window.horizontalScrollManager.getVisibleCardCount());
        console.log('Is transitioning:', window.horizontalScrollManager.isTransitioning);
        console.log('Manual toggle:', window.horizontalScrollManager.isManualToggle);
        console.log('Is checking layout:', window.horizontalScrollManager.isCheckingLayout);
        console.log('Scroll amount:', window.horizontalScrollManager.getScrollAmount());
        console.log('Card width:', window.horizontalScrollManager.getCardWidth());
        console.log('Gap size:', window.horizontalScrollManager.getGapSize());
        
        const grid = document.getElementById('programsGrid');
        if (grid) {
            console.log('Grid display:', grid.style.display);
            console.log('Grid classes:', grid.className);
            console.log('Grid scroll position:', grid.scrollLeft);
            console.log('Grid scroll width:', grid.scrollWidth);
            console.log('Grid client width:', grid.clientWidth);
        }
    } else {
        console.warn('⚠️ Horizontal scroll manager not initialized');
    }
};
/* ============================================ */
/* CSA AUDIO PLAYER - OPTIMIZED VERSION        */
/* Fixes: Multiple tracks, pause issues        */
/* ============================================ */

class CSAAudioPlayer {
    constructor() {
        // Core elements
        this.sidebar = document.getElementById('audioPlayerSidebar');
        this.overlay = document.getElementById('playerOverlay');
        this.trigger = document.getElementById('playerTrigger');
        this.closeBtn = document.getElementById('playerClose');
        
        // Controls
        this.playPauseBtn = document.getElementById('audioPlayPauseBtn');
        this.prevBtn = document.getElementById('audioPrevBtn');
        this.nextBtn = document.getElementById('audioNextBtn');
        this.volumeBtn = document.getElementById('audioVolumeBtn');
        this.volumeSlider = document.getElementById('audioVolumeSlider');
        
        // Progress
        this.progressContainer = document.getElementById('audioProgressContainer');
        this.progressBar = document.getElementById('audioProgressBar');
        this.currentTimeEl = document.getElementById('audioCurrentTime');
        this.totalTimeEl = document.getElementById('audioTotalTime');
        
        // Track info
        this.trackTitle = document.getElementById('trackTitle');
        this.waveformOverlay = document.getElementById('waveformOverlay');
        this.playlistItems = document.getElementById('audioPlaylistItems');
        
        // Audio element - SINGLE INSTANCE ONLY
        this.audio = null;
        this.boundEventHandlers = {};
        
        // State - simplified and bulletproof
        this.state = {
            isPlaying: false,
            isOpen: false,
            isLoading: false,
            isSeeking: false,
            currentTrackIndex: 0,
            volume: 75,
            previousVolume: 75,
            hasUserInteracted: false
        };
        
        // Action queue - prevents ALL race conditions
        this.actionQueue = Promise.resolve();
        this.isProcessingAction = false;
        
        // Cache for track durations
        this.playlistDurations = {};
        this.tempAudioElements = []; // Track temp elements for cleanup
        
        // Playlist
        this.playlist = [
            { 
                title: 'Summer Percussion Ensemble', 
                artist: 'CSA Music Program', 
                image: './images/programs/1.jpg',
                src: './media/track1.mp3'
            },
            { 
                title: 'Choir Spring Performance', 
                artist: 'CSA Vocal Program', 
                image: './images/programs/2.jpg',
                src: './media/track2.mp3'
            },
            { 
                title: 'Guitar Fundamentals', 
                artist: 'CSA Strings Program', 
                image: './images/programs/1.jpg',
                src: './media/track3.mp3'
            },
            { 
                title: 'Dance Rhythms Vol. 1', 
                artist: 'CSA Dance Program', 
                image: './images/programs/2.jpg',
                src: './media/track4.mp3'
            },
            { 
                title: 'Keyboard Classics', 
                artist: 'CSA Piano Program', 
                image: './images/programs/1.jpg',
                src: './media/track5.mp3'
            },
            { 
                title: 'Sports Anthem Mix', 
                artist: 'CSA Sports Program', 
                image: './images/programs/2.jpg',
                src: './media/track6.mp3'
            },
            { 
                title: 'DJ Introduction Beat', 
                artist: 'CSA DJ Program', 
                image: './images/programs/1.jpg',
                src: './media/track7.mp3'
            },
            { 
                title: 'Podcast Theme Song', 
                artist: 'CSA Media Program', 
                image: './images/programs/2.jpg',
                src: './media/track8.mp3'
            }
        ];
        
        this.init();
    }
    
    // ==================== INITIALIZATION ====================
    
    init() {
        if (!this.sidebar || !this.trigger) {
            console.warn('Audio player elements not found');
            return;
        }
        
        this.createAudioElement();
        this.hideShuffleRepeatButtons();
        this.bindEvents();
        this.generateWaveform();
        this.loadAllTrackDurations();
        this.updateVolumeSliderBackground();
        this.setVolume(this.state.volume);
        this.loadTrack(this.state.currentTrackIndex, false);
        
        console.log('🎵 CSA Audio Player initialized - Optimized Version');
    }
    
    createAudioElement() {
        // CRITICAL: Completely destroy old audio element
        this.destroyAudioElement();
        
        // Create new audio element
        this.audio = new Audio();
        this.audio.preload = 'metadata';
        this.audio.volume = this.state.volume / 100;
        
        // Bind events with stored references for cleanup
        this.bindAudioEvents();
    }
    
    destroyAudioElement() {
        if (!this.audio) return;
        
        // Stop all playback immediately
        try {
            this.audio.pause();
        } catch (e) {}
        
        // Remove all event listeners
        this.removeAudioEventListeners();
        
        // Clear source
        try {
            this.audio.src = '';
            this.audio.load();
        } catch (e) {}
        
        // Null reference
        this.audio = null;
    }
    
    removeAudioEventListeners() {
        if (!this.audio || !this.boundEventHandlers) return;
        
        Object.keys(this.boundEventHandlers).forEach(event => {
            this.audio.removeEventListener(event, this.boundEventHandlers[event]);
        });
        
        this.boundEventHandlers = {};
    }
    
    hideShuffleRepeatButtons() {
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');
        
        if (shuffleBtn) shuffleBtn.style.display = 'none';
        if (repeatBtn) repeatBtn.style.display = 'none';
    }
    
    // ==================== EVENT BINDING ====================
    
    bindEvents() {
        // Open/Close
        this.trigger?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });
        
        this.overlay?.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });
        
        this.closeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });
        
        // Playback controls - ALL go through queue
        this.playPauseBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.queueAction('togglePlay', () => this.togglePlay());
        });
        
        this.prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.queueAction('prevTrack', () => this.prevTrack());
        });
        
        this.nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.queueAction('nextTrack', () => this.nextTrack());
        });
        
        // Volume
        this.volumeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMute();
        });
        
        this.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });
        
        // Progress seeking
        this.setupProgressSeeking();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    bindAudioEvents() {
        if (!this.audio) return;
        
        // Store handlers so we can remove them later
        this.boundEventHandlers = {
            timeupdate: () => this.onTimeUpdate(),
            loadedmetadata: () => this.onLoadedMetadata(),
            canplay: () => this.onCanPlay(),
            playing: () => this.onPlaying(),
            pause: () => this.onPause(),
            waiting: () => this.onWaiting(),
            ended: () => this.onEnded(),
            error: (e) => this.onError(e)
        };
        
        // Add all listeners
        Object.keys(this.boundEventHandlers).forEach(event => {
            this.audio.addEventListener(event, this.boundEventHandlers[event]);
        });
    }
    
    // Audio event handlers - simplified
    onTimeUpdate() {
        if (!this.state.isSeeking) {
            this.updateProgress();
        }
    }
    
    onLoadedMetadata() {
        console.log('📀 Metadata loaded');
        this.updateDuration();
    }
    
    onCanPlay() {
        console.log('✅ Can play');
        this.state.isLoading = false;
        this.updateLoadingState(false);
    }
    
    onPlaying() {
        console.log('▶️ Playing');
        this.state.isPlaying = true;
        this.state.isLoading = false;
        this.updatePlayingState(true);
        this.updateLoadingState(false);
    }
    
    onPause() {
        // CRITICAL: Only update state if we're not in the middle of an action
        if (!this.isProcessingAction) {
            console.log('⏸️ Paused');
            this.state.isPlaying = false;
            this.updatePlayingState(false);
        }
    }
    
    onWaiting() {
        console.log('⏳ Buffering');
        this.state.isLoading = true;
        this.updateLoadingState(true);
    }
    
    onEnded() {
        console.log('⏹️ Track ended');
        this.state.isPlaying = false;
        this.updatePlayingState(false);
        
        // Queue next track (don't call directly to avoid race conditions)
        this.queueAction('autoNext', () => this.nextTrack());
    }
    
    onError(e) {
        console.error('❌ Audio error:', e);
        this.state.isPlaying = false;
        this.state.isLoading = false;
        this.updatePlayingState(false);
        this.updateLoadingState(false);
    }
    
    setupProgressSeeking() {
        if (!this.progressContainer) return;
        
        let isDragging = false;
        
        const handleSeek = (e) => {
            if (!this.audio?.duration || this.state.isLoading) return;
            
            const rect = this.progressContainer.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
            
            if (clientX === undefined) return;
            
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            
            this.state.isSeeking = true;
            this.audio.currentTime = percentage * this.audio.duration;
            
            setTimeout(() => {
                this.state.isSeeking = false;
            }, 100);
        };
        
        this.progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            handleSeek(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) handleSeek(e);
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        this.progressContainer.addEventListener('touchstart', handleSeek, { passive: true });
        this.progressContainer.addEventListener('touchmove', handleSeek, { passive: true });
    }
    
    // ==================== ACTION QUEUE SYSTEM ====================
    // This prevents ALL race conditions by serializing actions
    
    queueAction(actionName, actionFn) {
        this.actionQueue = this.actionQueue.then(async () => {
            console.log(`🎬 Executing: ${actionName}`);
            this.isProcessingAction = true;
            
            try {
                await actionFn();
            } catch (error) {
                console.error(`❌ Action failed: ${actionName}`, error);
            }
            
            // Small delay between actions
            await this.delay(50);
            this.isProcessingAction = false;
        });
        
        return this.actionQueue;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ==================== CORE PLAYBACK METHODS ====================
    
    async togglePlay() {
        if (this.state.isLoading) {
            console.log('⏳ Still loading...');
            return;
        }
        
        if (this.state.isPlaying) {
            await this.pause();
        } else {
            await this.play();
        }
    }
    
    async play() {
        if (!this.audio) {
            console.warn('⚠️ No audio element');
            return;
        }
        
        if (!this.audio.src || this.audio.src === '') {
            console.warn('⚠️ No audio source');
            return;
        }
        
        this.state.hasUserInteracted = true;
        
        try {
            // Ensure we're ready to play
            if (this.audio.readyState < 2) {
                console.log('⏳ Waiting for audio to be ready...');
                await this.waitForAudioReady();
            }
            
            await this.audio.play();
            this.state.isPlaying = true;
            this.updatePlayingState(true);
            console.log('▶️ Playback started');
        } catch (error) {
            console.error('❌ Play failed:', error);
            this.state.isPlaying = false;
            this.updatePlayingState(false);
        }
    }
    
    async pause() {
        if (!this.audio) return;
        
        console.log('⏸️ Pausing...');
        
        try {
            this.audio.pause();
            this.state.isPlaying = false;
            this.updatePlayingState(false);
            console.log('⏸️ Paused successfully');
        } catch (error) {
            console.error('❌ Pause failed:', error);
        }
    }
    
    // CRITICAL: Stop ALL audio immediately
    stopAll() {
        console.log('🛑 Stopping all audio');
        
        // Stop main audio
        if (this.audio) {
            try {
                this.audio.pause();
                this.audio.currentTime = 0;
            } catch (e) {}
        }
        
        // Stop any temp audio elements
        this.tempAudioElements.forEach(tempAudio => {
            try {
                tempAudio.pause();
                tempAudio.src = '';
            } catch (e) {}
        });
        
        this.state.isPlaying = false;
        this.updatePlayingState(false);
    }
    
    async prevTrack() {
        // If more than 3 seconds in, restart current track
        if (this.audio?.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        
        const newIndex = (this.state.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        await this.loadTrack(newIndex, this.state.isPlaying);
    }
    
    async nextTrack() {
        const newIndex = (this.state.currentTrackIndex + 1) % this.playlist.length;
        await this.loadTrack(newIndex, this.state.isPlaying);
    }
    
    async playTrack(index) {
    // CRITICAL FIX: Mark user interaction to enable playback
    // Without this, clicking playlist items won't work until play button is pressed first
    this.state.hasUserInteracted = true;
    
    if (index === this.currentTrackIndex) {
        await this.togglePlay();
    } else {
        await this.loadTrack(index, true);
    }
}
    
    async loadTrack(index, autoPlay = false) {
        // Validate index
        if (index < 0 || index >= this.playlist.length) {
            console.error('❌ Invalid track index:', index);
            return;
        }
        
        const track = this.playlist[index];
        if (!track || !track.src) {
            console.error('❌ Invalid track data');
            return;
        }
        
        console.log(`📀 Loading track ${index}: ${track.title}`);
        
        const wasPlaying = this.state.isPlaying;
        const shouldAutoPlay = autoPlay || wasPlaying;
        
        // Update state first
        this.state.isLoading = true;
        this.state.isPlaying = false;
        this.updateLoadingState(true);
        this.updatePlayingState(false);
        
        // CRITICAL: Stop current audio BEFORE loading new
        if (this.audio) {
            try {
                this.audio.pause();
                this.audio.currentTime = 0;
            } catch (e) {}
        }
        
        // Update track index
        this.state.currentTrackIndex = index;
        
        // Update UI
        this.updateTrackInfo(track);
        this.resetProgress();
        this.renderPlaylist();
        
        // Load new source
        try {
            this.audio.src = track.src;
            this.audio.load();
            
            // Wait for audio to be ready
            await this.waitForAudioReady();
            
            this.state.isLoading = false;
            this.updateLoadingState(false);
            
            // Auto play if needed
            if (shouldAutoPlay && this.state.hasUserInteracted) {
                await this.play();
            }
            
        } catch (error) {
            console.error('❌ Failed to load track:', error);
            this.state.isLoading = false;
            this.updateLoadingState(false);
        }
    }
    
    waitForAudioReady() {
        return new Promise((resolve, reject) => {
            if (!this.audio) {
                reject(new Error('No audio element'));
                return;
            }
            
            // Already ready
            if (this.audio.readyState >= 3) {
                resolve();
                return;
            }
            
            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error('Audio load timeout'));
            }, 10000);
            
            const onReady = () => {
                cleanup();
                resolve();
            };
            
            const onError = (e) => {
                cleanup();
                reject(e);
            };
            
            const cleanup = () => {
                clearTimeout(timeout);
                this.audio?.removeEventListener('canplay', onReady);
                this.audio?.removeEventListener('loadeddata', onReady);
                this.audio?.removeEventListener('error', onError);
            };
            
            this.audio.addEventListener('canplay', onReady, { once: true });
            this.audio.addEventListener('loadeddata', onReady, { once: true });
            this.audio.addEventListener('error', onError, { once: true });
        });
    }
    
    // ==================== UI UPDATE METHODS ====================
    
    updateTrackInfo(track) {
        if (this.trackTitle) {
            this.trackTitle.textContent = track.title;
        }
        
        const albumArt = document.querySelector('.album-art');
        if (albumArt) {
            albumArt.src = track.image;
        }
        
        const trackArtist = document.querySelector('.audio-player-sidebar .track-artist a');
        if (trackArtist) {
            trackArtist.textContent = track.artist;
        }
    }
    
    resetProgress() {
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = '0:00';
        }
        if (this.totalTimeEl) {
            const cached = this.playlistDurations[this.state.currentTrackIndex];
            this.totalTimeEl.textContent = cached ? this.formatTime(cached) : '--:--';
        }
    }
    
    updateProgress() {
        if (!this.audio?.duration || !this.progressBar) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        if (!this.audio?.duration) return;
        
        if (this.totalTimeEl) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
        
        this.playlistDurations[this.state.currentTrackIndex] = this.audio.duration;
        this.updatePlaylistItemDuration(this.state.currentTrackIndex, this.audio.duration);
    }
    
    updatePlayingState(isPlaying) {
        if (isPlaying) {
            this.sidebar?.classList.add('playing');
        } else {
            this.sidebar?.classList.remove('playing');
        }
        this.updatePlaylistActiveState();
    }
    
    updateLoadingState(isLoading) {
        if (isLoading) {
            this.playPauseBtn?.classList.add('loading');
        } else {
            this.playPauseBtn?.classList.remove('loading');
        }
    }
    
    updatePlaylistActiveState() {
        const items = this.playlistItems?.querySelectorAll('.playlist-item');
        if (!items) return;
        
        items.forEach((item, index) => {
            item.classList.remove('active', 'playing');
            
            if (index === this.state.currentTrackIndex) {
                item.classList.add('active');
                if (this.state.isPlaying) {
                    item.classList.add('playing');
                }
            }
        });
    }
    
    updatePlaylistItemDuration(index, duration) {
        const items = this.playlistItems?.querySelectorAll('.playlist-item');
        if (items && items[index]) {
            const durationEl = items[index].querySelector('.item-duration');
            if (durationEl) {
                durationEl.textContent = this.formatTime(duration);
            }
        }
    }
    
    // ==================== PLAYLIST MANAGEMENT ====================
    
    loadAllTrackDurations() {
    // Cleanup any existing temp elements
    this.cleanupTempAudioElements();
    
    // Load durations sequentially with delays to avoid overwhelming the browser
    this.playlist.forEach((track, index) => {
        // Stagger the loads by 100ms each
        setTimeout(() => {
            this.loadSingleTrackDuration(track, index);
        }, index * 100);
    });
}

loadSingleTrackDuration(track, index) {
    const tempAudio = new Audio();
    tempAudio.preload = 'metadata';
    
    // Track for cleanup
    this.tempAudioElements.push(tempAudio);
    
    // Set a timeout to prevent infinite waiting
    const loadTimeout = setTimeout(() => {
        console.log(`⏱️ Track ${index} metadata load timeout - using placeholder`);
        cleanup();
    }, 5000);
    
    const onLoaded = () => {
        clearTimeout(loadTimeout);
        this.playlistDurations[index] = tempAudio.duration;
        this.updatePlaylistItemDuration(index, tempAudio.duration);
        console.log(`✅ Track ${index} duration: ${this.formatTime(tempAudio.duration)}`);
        cleanup();
    };
    
    const onError = (e) => {
        clearTimeout(loadTimeout);
        console.log(`ℹ️ Track ${index} metadata not preloaded (will load on demand)`);
        cleanup();
    };
    
    const cleanup = () => {
        try {
            tempAudio.src = '';
            tempAudio.load();
        } catch (e) {}
    };
    
    tempAudio.addEventListener('loadedmetadata', onLoaded, { once: true });
    tempAudio.addEventListener('error', onError, { once: true });
    
    try {
        tempAudio.src = track.src;
        tempAudio.load();
    } catch (error) {
        console.log(`ℹ️ Track ${index}: ${error.message}`);
        cleanup();
    }
}
    
    cleanupTempAudioElements() {
        this.tempAudioElements.forEach(temp => {
            try {
                temp.pause();
                temp.src = '';
            } catch (e) {}
        });
        this.tempAudioElements = [];
    }
    
    renderPlaylist() {
        if (!this.playlistItems) return;
        
        this.playlistItems.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const isActive = index === this.state.currentTrackIndex;
            const isPlaying = isActive && this.state.isPlaying;
            
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (isActive) item.classList.add('active');
            if (isPlaying) item.classList.add('playing');
            
            const duration = this.playlistDurations[index] 
                ? this.formatTime(this.playlistDurations[index]) 
                : '--:--';
            
            item.innerHTML = `
                <span class="item-number">${index + 1}</span>
                <div class="item-playing-icon">
                    <div class="playing-bar"></div>
                    <div class="playing-bar"></div>
                    <div class="playing-bar"></div>
                </div>
                <div class="item-thumbnail">
                    <img src="${track.image}" alt="${track.title}" loading="lazy">
                </div>
                <div class="item-info">
                    <div class="item-title">${track.title}</div>
                    <div class="item-artist">${track.artist}</div>
                </div>
                <span class="item-duration">${duration}</span>
            `;
            
            // Queue the action to prevent race conditions
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.queueAction('playTrack', () => this.playTrack(index));
            });
            
            this.playlistItems.appendChild(item);
        });
        
        const queueCount = document.querySelector('.queue-count');
        if (queueCount) {
            queueCount.textContent = `${this.playlist.length} tracks`;
        }
    }
    
    // ==================== SIDEBAR CONTROLS ====================
    
    toggle() {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        const scrollPosition = window.scrollY;

        this.state.isOpen = true;
        this.sidebar?.classList.add('active');
        this.overlay?.classList.add('active');
        this.trigger?.classList.add('active');

        document.body.classList.add('player-open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollPosition}px`;
        
        if (this.sidebar) {
            this.sidebar.style.overflowY = 'auto';
            this.sidebar.style.webkitOverflowScrolling = 'touch';
        }
    }
    
    close() {
        this.state.isOpen = false;
        this.sidebar?.classList.remove('active');
        this.overlay?.classList.remove('active');
        this.trigger?.classList.remove('active');

        const scrollY = parseInt(document.body.style.top || '0') * -1;
        document.body.classList.remove('player-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    }
    
    // ==================== VOLUME CONTROLS ====================
    
    toggleMute() {
        if (this.state.volume > 0) {
            this.state.previousVolume = this.state.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.state.previousVolume || 75);
        }
    }
    
    setVolume(value) {
        this.state.volume = parseInt(value);
        
        if (this.volumeSlider) {
            this.volumeSlider.value = this.state.volume;
        }
        
        if (this.audio) {
            this.audio.volume = this.state.volume / 100;
        }
        
        this.updateVolumeSliderBackground();
        this.updateVolumeIcon();
    }
    
updateVolumeSliderBackground() {
    if (!this.volumeSlider) return;
    
    const value = this.state.volume;
    
    // Smooth color interpolation using your exact brand colors
    let fillColor;
    if (value <= 50) {
        // Blend from green (#3cb34d) to gold (#fcb326)
        const ratio = value / 50;
        const r = Math.round(60 + (252 - 60) * ratio);
        const g = Math.round(179 + (179 - 179) * ratio);
        const b = Math.round(77 + (38 - 77) * ratio);
        fillColor = `rgb(${r}, ${g}, ${b})`;
    } else {
        // Blend from gold (#fcb326) to red (#f31b28)
        const ratio = (value - 50) / 50;
        const r = Math.round(252 + (243 - 252) * ratio);
        const g = Math.round(179 + (27 - 179) * ratio);
        const b = Math.round(38 + (40 - 38) * ratio);
        fillColor = `rgb(${r}, ${g}, ${b})`;
    }
    
    this.volumeSlider.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${value}%, #181818 ${value}%, #181818 100%)`;
}
    
    updateVolumeIcon() {
        const icon = document.getElementById('audioVolumeIcon');
        if (!icon) return;
        
        if (this.state.volume === 0) {
            icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else if (this.state.volume < 50) {
            icon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
        } else {
            icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }
    
    // ==================== WAVEFORM ====================
    
    generateWaveform() {
        if (!this.waveformOverlay) return;
        
        const numBars = 30;
        this.waveformOverlay.innerHTML = '';
        
        for (let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            const height = 15 + Math.random() * 35;
            bar.style.setProperty('--wave-height', `${height}px`);
            bar.style.animationDelay = `${i * 0.05}s`;
            this.waveformOverlay.appendChild(bar);
        }
    }
    
    // ==================== KEYBOARD CONTROLS ====================
    
    handleKeyboard(e) {
        if (!this.state.isOpen) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.queueAction('togglePlay', () => this.togglePlay());
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (this.audio?.duration) {
                    this.audio.currentTime = Math.max(0, this.audio.currentTime - 5);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (this.audio?.duration) {
                    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 5);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(100, this.state.volume + 5));
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(0, this.state.volume - 5));
                break;
            case 'KeyM':
                this.toggleMute();
                break;
            case 'KeyN':
                this.queueAction('nextTrack', () => this.nextTrack());
                break;
            case 'KeyP':
                this.queueAction('prevTrack', () => this.prevTrack());
                break;
            case 'Escape':
                this.close();
                break;
        }
    }
    
    // ==================== UTILITY METHODS ====================
    
    formatTime(seconds) {
        if (isNaN(seconds) || seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // ==================== PUBLIC API ====================
    
    getPlaylist() {
        return this.playlist;
    }
    
    setPlaylist(newPlaylist) {
        this.stopAll();
        this.playlist = newPlaylist;
        this.state.currentTrackIndex = 0;
        this.playlistDurations = {};
        this.loadAllTrackDurations();
        this.queueAction('loadTrack', () => this.loadTrack(0, false));
    }
    
    addTrack(track) {
        const newIndex = this.playlist.length;
        this.playlist.push(track);
        
        const tempAudio = new Audio();
        tempAudio.preload = 'metadata';
        this.tempAudioElements.push(tempAudio);
        
        tempAudio.addEventListener('loadedmetadata', () => {
            this.playlistDurations[newIndex] = tempAudio.duration;
            this.updatePlaylistItemDuration(newIndex, tempAudio.duration);
            tempAudio.src = '';
        }, { once: true });
        
        tempAudio.src = track.src;
        this.renderPlaylist();
    }
    
    getCurrentTrack() {
        return this.playlist[this.state.currentTrackIndex];
    }
    
    getState() {
        return { ...this.state };
    }
    
    // Emergency stop - use if something goes wrong
    emergencyStop() {
        console.log('🚨 Emergency stop activated');
        this.stopAll();
        this.cleanupTempAudioElements();
        this.destroyAudioElement();
        this.createAudioElement();
        this.loadTrack(this.state.currentTrackIndex, false);
    }
}

// Initialize Audio Player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are ready
    setTimeout(() => {
        window.csaAudioPlayer = new CSAAudioPlayer();
    }, 100);
});

// Debug helper
window.debugAudioPlayer = () => {
    if (window.csaAudioPlayer) {
        console.log('🎵 State:', window.csaAudioPlayer.getState());
        console.log('📀 Current Track:', window.csaAudioPlayer.getCurrentTrack());
        console.log('📋 Playlist:', window.csaAudioPlayer.getPlaylist());
        console.log('⏱️ Durations:', window.csaAudioPlayer.playlistDurations);
        console.log('🔊 Audio Element:', window.csaAudioPlayer.audio);
    }
};

// Emergency stop helper
window.stopAllAudio = () => {
    window.csaAudioPlayer?.emergencyStop();
};

/* ============================================ */
/* TESTIMONIALS CAROUSEL - iOS Optimized       */
/* ============================================ */

class TestimonialsCarousel {
    constructor() {
        this.grid = document.getElementById('testimonialsGrid');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.dotsContainer = document.getElementById('testimonialDots');
        this.dots = [];
        this.currentIndex = 0;
        this.isAnimating = false;
        
        if (!this.grid) return;
        
        this.cards = Array.from(this.grid.querySelectorAll('.testimonial-card'));
        this.totalCards = this.cards.length;
        
        this.init();
    }
    
    init() {
        // Only enable carousel on mobile
        if (window.innerWidth > 900) return;
        
        console.log('📱 Testimonials Carousel initialized');
        
        this.setupDots();
        this.bindEvents();
        this.updateUI();
    }
    
    setupDots() {
        if (!this.dotsContainer) return;
        
        this.dots = Array.from(this.dotsContainer.querySelectorAll('.dot'));
    }
    
    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
        
        // Scroll detection for iOS
        let scrollTimeout;
        this.grid.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                this.detectCurrentCard();
            }, 150);
        }, { passive: true });
        
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth <= 900) {
                    this.updateUI();
                }
            }, 250);
        });
        
        // Touch gestures for iOS
        this.setupTouchGestures();
    }
    
    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.grid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.grid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next
                this.next();
            } else {
                // Swiped right - go to prev
                this.prev();
            }
        }
    }
    
    detectCurrentCard() {
        const scrollLeft = this.grid.scrollLeft;
        const cardWidth = this.cards[0]?.offsetWidth || 0;
        const gap = 20;
        
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.totalCards) {
            this.currentIndex = newIndex;
            this.updateUI();
        }
    }
    
    prev() {
        if (this.isAnimating || this.currentIndex === 0) return;
        
        this.currentIndex--;
        this.scrollToCard(this.currentIndex);
    }
    
    next() {
        if (this.isAnimating || this.currentIndex === this.totalCards - 1) return;
        
        this.currentIndex++;
        this.scrollToCard(this.currentIndex);
    }
    
    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.scrollToCard(this.currentIndex);
    }
    
    scrollToCard(index) {
        if (!this.cards[index]) return;
        
        this.isAnimating = true;
        
        const card = this.cards[index];
        const cardWidth = card.offsetWidth;
        const gap = 20;
        const scrollPosition = index * (cardWidth + gap);
        
        this.grid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            this.isAnimating = false;
            this.updateUI();
        }, 400);
    }
    
    updateUI() {
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.totalCards - 1;
        }
        
        // Update dots
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all elements are ready
    setTimeout(() => {
        window.testimonialsCarousel = new TestimonialsCarousel();
    }, 100);
});

// Reinitialize on resize if needed
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth <= 900 && !window.testimonialsCarousel) {
            window.testimonialsCarousel = new TestimonialsCarousel();
        }
    }, 250);
});
document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.querySelector('.contact-icon-btn.email');
    
    if (emailBtn) {
        emailBtn.addEventListener('click', function(e) {
            // Stop the event from bubbling up to parent elements
            e.stopPropagation();
            
            // The mailto link will work by default - we just prevent interference
            console.log('📧 Opening email client...');
        }, true); // Use capture phase to handle it first
    }
});
/* ============================================ */
/* INTERACTIVE GRADIENT TEXT - MOUSE TRACKING  */
/* ============================================ */

class InteractiveGradientText {
    constructor() {
        this.titles = document.querySelectorAll('.section-header h2');
        this.init();
    }
    
    init() {
        if (!this.titles.length) {
            console.warn('No gradient titles found');
            return;
        }
        
        this.titles.forEach(title => {
            // Store original text in data attribute for ::after
            title.setAttribute('data-text', title.textContent);
            
            // Track mouse movement with throttling
            let rafId = null;
            
            title.addEventListener('mousemove', (e) => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                
                rafId = requestAnimationFrame(() => {
                    this.updateGradientPosition(title, e);
                });
            });
            
            // Reset on mouse leave
            title.addEventListener('mouseleave', () => {
                this.resetGradientPosition(title);
            });
            
            console.log('✨ Interactive gradient added to:', title.textContent.substring(0, 20));
        });
        
        console.log(`✅ Interactive gradient text initialized on ${this.titles.length} titles`);
    }
    
    updateGradientPosition(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert to percentage
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        // Clamp values
        const clampedX = Math.max(0, Math.min(100, xPercent));
        const clampedY = Math.max(0, Math.min(100, yPercent));
        
        // Update CSS variables
        element.style.setProperty('--mouse-x', `${clampedX}%`);
        element.style.setProperty('--mouse-y', `${clampedY}%`);
    }
    
    resetGradientPosition(element) {
        // Smooth reset to center
        element.style.setProperty('--mouse-x', '50%');
        element.style.setProperty('--mouse-y', '50%');
    }
}

// Initialize when DOM is ready - with multiple fallbacks
function initInteractiveGradient() {
    if (!window.interactiveGradientText) {
        console.log('🎨 Initializing interactive gradient text...');
        window.interactiveGradientText = new InteractiveGradientText();
    }
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initInteractiveGradient, 100);
    });
} else {
    // DOM already loaded
    setTimeout(initInteractiveGradient, 100);
}

// Backup initialization
setTimeout(() => {
    if (!window.interactiveGradientText) {
        console.log('🔄 Backup gradient initialization...');
        initInteractiveGradient();
    }
}, 1000);

// Debug helper
window.testGradientInteraction = () => {
    const titles = document.querySelectorAll('.section-header h2');
    console.log('Found titles:', titles.length);
    titles.forEach((title, i) => {
        console.log(`Title ${i}:`, title.textContent);
        console.log(`  - Has data-text:`, title.hasAttribute('data-text'));
        console.log(`  - Mouse X:`, title.style.getPropertyValue('--mouse-x'));
        console.log(`  - Mouse Y:`, title.style.getPropertyValue('--mouse-y'));
    });
};
/* ============================================ */
/* GALLERY FILTERING WITH LIVE COUNT UPDATE    */
/* ============================================ */

class GalleryFilter {
    constructor() {
        // Filter elements
        this.categoryFilter = document.getElementById('categoryFilter');
        this.programFilter = document.getElementById('programFilter');
        this.locationFilter = document.getElementById('locationFilter');
        this.dateFilter = document.getElementById('dateFilter');
        this.resetBtn = document.getElementById('filterReset');
        
        // Gallery elements
        this.galleryGrid = document.getElementById('galleryGrid');
        this.galleryItems = [];
        
        // Count elements
        this.visibleCount = document.getElementById('visibleCount');
        this.totalCount = document.getElementById('totalCount');
        
        this.init();
    }
    
    init() {
        if (!this.galleryGrid) {
            console.log('Gallery not found on this page');
            return;
        }
        
        // Get all gallery items
        this.galleryItems = Array.from(this.galleryGrid.querySelectorAll('.gallery-item'));
        
        // Set total count
        if (this.totalCount) {
            this.totalCount.textContent = this.galleryItems.length;
        }
        
        // Bind filter events
        this.bindEvents();
        
        // Initial count update
        this.updateVisibleCount();
        
        console.log(`🖼️ Gallery filter initialized with ${this.galleryItems.length} photos`);
    }
    
    bindEvents() {
        // Filter change events
        [this.categoryFilter, this.programFilter, this.locationFilter, this.dateFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });
        
        // Reset button
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }
    
    applyFilters() {
        const category = this.categoryFilter?.value || 'all';
        const program = this.programFilter?.value || 'all';
        const location = this.locationFilter?.value || 'all';
        const date = this.dateFilter?.value || 'all';
        
        let visibleCount = 0;
        
        this.galleryItems.forEach(item => {
            const itemCategories = (item.dataset.category || '').split(',').map(c => c.trim());
            const itemSubcategory = item.dataset.subcategory || '';
            const itemLocation = item.dataset.location || '';
            const itemDate = item.dataset.date || '';
            
            // Check each filter
            const categoryMatch = category === 'all' || itemCategories.includes(category);
            const programMatch = program === 'all' || itemSubcategory === program;
            const locationMatch = location === 'all' || itemLocation === location;
            const dateMatch = date === 'all' || itemDate === date;
            
            // Show/hide based on all filters
            if (categoryMatch && programMatch && locationMatch && dateMatch) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Update visible count
        this.updateVisibleCount(visibleCount);
        
        console.log(`🔍 Filters applied: ${visibleCount} photos visible`);
    }
    
    resetFilters() {
        // Reset all dropdowns to "all"
        if (this.categoryFilter) this.categoryFilter.value = 'all';
        if (this.programFilter) this.programFilter.value = 'all';
        if (this.locationFilter) this.locationFilter.value = 'all';
        if (this.dateFilter) this.dateFilter.value = 'all';
        
        // Show all items
        this.galleryItems.forEach(item => {
            item.classList.remove('hidden');
        });
        
        // Update count
        this.updateVisibleCount(this.galleryItems.length);
        
        console.log('🔄 Filters reset - all photos visible');
    }
    
    updateVisibleCount(count = null) {
        if (!this.visibleCount) return;
        
        // If count not provided, calculate it
        if (count === null) {
            count = this.galleryItems.filter(item => !item.classList.contains('hidden')).length;
        }
        
        // Update the display with smooth animation
        this.visibleCount.style.opacity = '0.5';
        
        setTimeout(() => {
            this.visibleCount.textContent = count;
            this.visibleCount.style.opacity = '1';
        }, 150);
    }
}

// Initialize Gallery Filter
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.galleryFilter = new GalleryFilter();
    }, 200);
});

// Backup initialization
setTimeout(() => {
    if (!window.galleryFilter) {
        console.log('🔄 Backup gallery filter initialization...');
        window.galleryFilter = new GalleryFilter();
    }
}, 1500);

// Debug helper
window.debugGallery = () => {
    if (window.galleryFilter) {
        console.log('🖼️ Gallery Debug Info:');
        console.log('Total items:', window.galleryFilter.galleryItems.length);
        console.log('Visible items:', window.galleryFilter.galleryItems.filter(i => !i.classList.contains('hidden')).length);
    }
};
// Add this JavaScript to detect scroll and darken the player trigger
const playerTrigger = document.getElementById('playerTrigger');

function updatePlayerTriggerOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > 50) {
        playerTrigger.classList.add('scrolled');
    } else {
        playerTrigger.classList.remove('scrolled');
    }
}
// Listen for scroll events
window.addEventListener('scroll', updatePlayerTriggerOnScroll, { passive: true });

// Run on page load
updatePlayerTriggerOnScroll();