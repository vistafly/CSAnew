// script.js 
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
 * PROFESSIONAL HORIZONTAL SCROLL MANAGER
 * High-end animations, bulletproof functionality, responsive design
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
        if (this.isTransitioning) return;
        
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
    }
    
    getVisibleCards() {
        return Array.from(this.programsGrid.querySelectorAll('.program-card:not(.hidden):not([style*="display: none"]):not([style*="visibility: hidden"])'));
    }
    
    getCardWidth() {
        const isMobile = window.innerWidth <= 768;
        return isMobile ? 280 : 300;
    }
    
    getGapSize() {
        const isMobile = window.innerWidth <= 768;
        return isMobile ? 16 : 24;
    }
    
    enableScrollMode() {
        if (this.isScrollMode || this.isTransitioning) return;
        
        console.log('🔄 Enabling horizontal scroll mode...');
        
        this.isTransitioning = true;
        this.isScrollMode = true;
        
        // CRITICAL: Proper transition to flex layout
        this.programsGrid.style.display = 'flex';
        this.programsGrid.style.flexDirection = 'row';
        this.programsGrid.style.flexWrap = 'nowrap';
        this.programsGrid.style.overflowX = 'auto';
        this.programsGrid.style.overflowY = 'hidden';
        this.programsGrid.style.gap = '24px';
        this.programsGrid.style.justifyContent = 'flex-start';
        this.programsGrid.style.alignItems = 'stretch';
        
        // Remove grid properties
        this.programsGrid.style.gridTemplateColumns = '';
        this.programsGrid.style.justifyItems = '';
        
        // Add scroll class
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
    
    scrollLeft() {
        if (!this.isScrollMode || !this.programsGrid) return;
        
        const scrollAmount = this.getCardWidth() + this.getGapSize();
        
        this.programsGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        
        console.log('⬅️ Scrolling left by', scrollAmount, 'px');
    }
    
    scrollRight() {
        if (!this.isScrollMode || !this.programsGrid) return;
        
        const scrollAmount = this.getCardWidth() + this.getGapSize();
        
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
    
    // CRITICAL: Handle filtering properly
    handleFilterChange() {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        
        this.filterTimeout = setTimeout(() => {
            console.log('🔍 Filter change detected, checking layout...');
            
            // Always ensure proper layout first
            if (!this.isScrollMode) {
                this.forceGridLayout();
            }
            
            // Then check if scroll is needed
            this.checkScrollNeed();
        }, 100);
    }
    
    // Observer for DOM changes (filter updates)
    observeGridChanges() {
        if (!this.programsGrid) return;
        
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || 
                     mutation.attributeName === 'style')) {
                    shouldCheck = true;
                }
                
                if (mutation.type === 'childList') {
                    shouldCheck = true;
                }
            });
            
            if (shouldCheck) {
                this.handleFilterChange();
            }
        });
        
        observer.observe(this.programsGrid, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
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
            
            // Update scroll manager after filtering
            setTimeout(() => {
                if (window.horizontalScrollManager) {
                    window.horizontalScrollManager.handleFilterChange();
                }
            }, 50);
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
        
        const grid = document.getElementById('programsGrid');
        if (grid) {
            console.log('Grid display:', grid.style.display);
            console.log('Grid classes:', grid.className);
        }
    } else {
        console.warn('⚠️ Horizontal scroll manager not initialized');
    }
};