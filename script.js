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

// Enhanced program card interactions
document.addEventListener('DOMContentLoaded', () => {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('hidden')) return;
            
            const program = this.dataset.subcategory;
            const title = this.querySelector('.program-title')?.textContent;
            
            console.log('Program clicked:', title);
            
            // Navigate to gallery if authenticated
            if (typeof currentUser !== 'undefined' && currentUser) {
                // Apply filter to gallery if it exists
                if (document.getElementById('programFilter')) {
                    document.getElementById('programFilter').value = program || 'all';
                    if (typeof filterGallery === 'function') {
                        filterGallery();
                    }
                }
                
                // Scroll to gallery
                const gallery = document.getElementById('gallery');
                if (gallery) {
                    gallery.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Show login modal
                if (typeof showModal === 'function') {
                    showModal('loginModal');
                }
                if (typeof showNotification === 'function') {
                    showNotification('Please sign in to view gallery content', 'error');
                }
            }
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
        const containerWidth = this.programsGrid.offsetWidth;
        const cardWidth = this.getCardWidth();
        const gap = this.getGapSize();
        const cardsPerRow = Math.floor(containerWidth / (cardWidth + gap));
        
        console.log(`📊 Scroll check: ${visibleCards.length} cards, ${cardsPerRow} per row, threshold: ${this.scrollThreshold}`);
        
        const shouldUseScroll = visibleCards.length > Math.max(this.scrollThreshold, cardsPerRow);
        
        if (shouldUseScroll && !this.isScrollMode && !this.isManualToggle) {
            this.enableScrollMode();
        } else if (!shouldUseScroll && this.isScrollMode && !this.isManualToggle) {
            this.disableScrollMode();
        } else if (!this.isScrollMode) {
            // CRITICAL: Always enforce grid layout when not in scroll mode
            this.forceGridLayout();
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
        // Already checking, skip this call
        return;
    }
    
    if (this.filterTimeout) {
        clearTimeout(this.filterTimeout);
    }
    
    // Optimized debounce time
    this.filterTimeout = setTimeout(() => {
        console.log('🔍 Filter change detected, checking layout...');
        
        const visibleCards = this.getVisibleCards();
        const shouldBeScrollMode = visibleCards.length > this.scrollThreshold;
        
        // Maintain layout mode during filtering
        if (shouldBeScrollMode && this.isScrollMode) {
            // Already in correct mode, just update
            this.updateCardCount(visibleCards.length);
            this.updateScrollButtons();
        } else if (!shouldBeScrollMode && !this.isScrollMode) {
            // Already in correct mode, just update
            this.forceGridLayout();
            this.updateCardCount(visibleCards.length);
        } else {
            // Need to switch modes
            this.checkScrollNeed();
        }
    }, 200); // Balanced timing
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
/* CSA AUDIO PLAYER - SPOTIFY INSPIRED SIDEBAR */
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
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
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
        
        // State
        this.isPlaying = false;
        this.isOpen = false;
        this.isShuffle = false;
        this.repeatMode = 0;
        this.volume = 75;
        this.currentTrackIndex = 0;
        this.progress = 0;
        this.progressInterval = null;
        this.previousVolume = 75;
        
        // Demo playlist with CSA programs
        this.playlist = [
            { title: 'Summer Percussion Ensemble', artist: 'CSA Music Program', duration: '4:05', image: './images/programs/1.jpg' },
            { title: 'Choir Spring Performance', artist: 'CSA Vocal Program', duration: '3:42', image: './images/programs/2.jpg' },
            { title: 'Guitar Fundamentals', artist: 'CSA Strings Program', duration: '5:18', image: './images/programs/1.jpg' },
            { title: 'Dance Rhythms Vol. 1', artist: 'CSA Dance Program', duration: '4:30', image: './images/programs/2.jpg' },
            { title: 'Keyboard Classics', artist: 'CSA Piano Program', duration: '6:12', image: './images/programs/1.jpg' },
            { title: 'Sports Anthem Mix', artist: 'CSA Sports Program', duration: '3:55', image: './images/programs/2.jpg' },
            { title: 'DJ Introduction Beat', artist: 'CSA DJ Program', duration: '4:48', image: './images/programs/1.jpg' },
            { title: 'Podcast Theme Song', artist: 'CSA Media Program', duration: '2:15', image: './images/programs/2.jpg' }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.sidebar || !this.trigger) {
            console.warn('Audio player elements not found');
            return;
        }
        
        this.bindEvents();
        this.generateWaveform();
        this.renderPlaylist();
        this.updateVolumeSliderBackground();
        console.log('🎵 CSA Audio Player initialized');
    }
    
    bindEvents() {
        // Open/Close
        this.trigger.addEventListener('click', () => this.toggle());
        this.overlay.addEventListener('click', () => this.close());
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Playback controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Volume
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Progress
        this.progressContainer.addEventListener('click', (e) => this.seek(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
    this.isOpen = true;
    this.sidebar.classList.add('active');
    this.overlay.classList.add('active');
    this.trigger.classList.add('active');
    document.body.classList.add('player-open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
    
    // Force sidebar to be scrollable
    this.sidebar.style.overflowY = 'auto';
    this.sidebar.style.webkitOverflowScrolling = 'touch';
}
    
    close() {
    this.isOpen = false;
    this.sidebar.classList.remove('active');
    this.overlay.classList.remove('active');
    this.trigger.classList.remove('active');
    
    // Restore body scroll position
    const scrollY = document.body.style.top;
    document.body.classList.remove('player-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.sidebar.classList.add('playing');
            this.startProgressSimulation();
        } else {
            this.sidebar.classList.remove('playing');
            this.stopProgressSimulation();
        }
    }
    
    startProgressSimulation() {
        const track = this.playlist[this.currentTrackIndex];
        const durationParts = track.duration.split(':');
        const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
        
        this.progressInterval = setInterval(() => {
            this.progress += 0.5;
            if (this.progress >= 100) {
                this.progress = 0;
                this.nextTrack();
            }
            this.updateProgress(totalSeconds);
        }, totalSeconds * 5);
    }
    
    stopProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    updateProgress(totalSeconds = 245) {
        this.progressBar.style.width = `${this.progress}%`;
        
        const currentSeconds = Math.floor((this.progress / 100) * totalSeconds);
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        this.currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    seek(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        this.progress = Math.max(0, Math.min(100, percentage));
        this.updateProgress();
    }
    
    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack();
    }
    
    nextTrack() {
        if (this.isShuffle) {
            this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        }
        this.loadTrack();
    }
    
    loadTrack() {
        const track = this.playlist[this.currentTrackIndex];
        this.trackTitle.textContent = track.title;
        this.totalTimeEl.textContent = track.duration;
        this.progress = 0;
        this.updateProgress();
        this.renderPlaylist();
        
        // Update album art
        const albumArt = document.querySelector('.album-art');
        if (albumArt) {
            albumArt.src = track.image;
        }
        
        // Update track artist
        const trackArtist = document.querySelector('.audio-player-sidebar .track-artist a');
        if (trackArtist) {
            trackArtist.textContent = track.artist;
        }
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }
    
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        this.repeatBtn.classList.toggle('active', this.repeatMode > 0);
    }
    
    toggleMute() {
        if (this.volume > 0) {
            this.previousVolume = this.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 75);
        }
    }
    
    setVolume(value) {
        this.volume = parseInt(value);
        this.volumeSlider.value = this.volume;
        this.updateVolumeSliderBackground();
        this.updateVolumeIcon();
    }
    
    updateVolumeSliderBackground() {
        const value = this.volume;
        this.volumeSlider.style.background = `linear-gradient(to right, #d32f2f 0%, #d32f2f ${value}%, #181818 ${value}%, #181818 100%)`;
    }
    
    updateVolumeIcon() {
        const icon = document.getElementById('audioVolumeIcon');
        if (!icon) return;
        
        if (this.volume === 0) {
            icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else if (this.volume < 50) {
            icon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
        } else {
            icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }
    
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
    
    renderPlaylist() {
        if (!this.playlistItems) return;
        
        this.playlistItems.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item${index === this.currentTrackIndex ? ' active playing' : ''}`;
            
            item.innerHTML = `
                <span class="item-number">${index + 1}</span>
                <div class="item-playing-icon">
                    <div class="playing-bar"></div>
                    <div class="playing-bar"></div>
                    <div class="playing-bar"></div>
                </div>
                <div class="item-thumbnail">
                    <img src="${track.image}" alt="${track.title}">
                </div>
                <div class="item-info">
                    <div class="item-title">${track.title}</div>
                    <div class="item-artist">${track.artist}</div>
                </div>
                <span class="item-duration">${track.duration}</span>
            `;
            
            item.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack();
                if (!this.isPlaying) {
                    this.togglePlay();
                }
            });
            
            this.playlistItems.appendChild(item);
        });
    }
    
    handleKeyboard(e) {
        if (!this.isOpen) return;
        
        // Don't capture if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.progress = Math.max(0, this.progress - 5);
                this.updateProgress();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.progress = Math.min(100, this.progress + 5);
                this.updateProgress();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(100, this.volume + 5));
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(0, this.volume - 5));
                break;
            case 'KeyM':
                this.toggleMute();
                break;
            case 'KeyN':
                this.nextTrack();
                break;
            case 'KeyP':
                this.prevTrack();
                break;
            case 'KeyS':
                this.toggleShuffle();
                break;
            case 'KeyR':
                this.toggleRepeat();
                break;
            case 'Escape':
                this.close();
                break;
        }
    }
}

// Initialize Audio Player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        window.csaAudioPlayer = new CSAAudioPlayer();
    }, 500);
});

// Backup initialization
window.addEventListener('load', () => {
    if (!window.csaAudioPlayer) {
        window.csaAudioPlayer = new CSAAudioPlayer();
    }
});
/* END CSA AUDIO PLAYER */