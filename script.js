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
            
            // Update carousel after filtering
            if (window.programsCarousel) {
                window.programsCarousel.updateForFilters();
            }
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
        
        // Update carousel after clearing
        setTimeout(() => {
            if (window.programsCarousel) {
                window.programsCarousel.updateForFilters();
            }
        }, 100);
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

// Mobile Carousel Implementation
class ProgramsCarousel {
    constructor() {
        this.grid = document.querySelector('.programs-grid');
        this.container = null;
        this.currentIndex = 0;
        this.cards = [];
        this.dots = [];
        this.isMobile = window.innerWidth <= 1230;
        this.isInitialized = false;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        if (this.isMobile) {
            this.setupCarousel();
        }
    }
    
    setupCarousel() {
        if (this.isInitialized || !this.grid) return;
        
        // Create carousel container
        this.container = document.createElement('div');
        this.container.className = 'programs-carousel-container';
        this.container.style.display = 'block';
        
        // Wrap the grid
        this.grid.parentNode.insertBefore(this.container, this.grid);
        this.container.appendChild(this.grid);
        
        // Add carousel mode class
        this.grid.classList.add('carousel-mode');
        
        // Get visible cards
        this.updateCards();
        
        if (this.cards.length > 1) {
            // Create navigation
            this.createNavigation();
            this.createDots();
            this.createProgressBar();
            
            // Set initial state
            this.updateDots();
            this.updateNavigation();
            this.updateProgress();
            
            // Setup scroll listener
            this.setupScrollListener();
        }
        
        this.isInitialized = true;
        console.log('Carousel initialized with', this.cards.length, 'cards');
    }
    
    updateCards() {
        this.cards = Array.from(this.grid.querySelectorAll('.program-card:not(.hidden)'));
    }
    
    createNavigation() {
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav prev';
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
        `;
        prevBtn.addEventListener('click', () => this.prev());
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav next';
        nextBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
        `;
        nextBtn.addEventListener('click', () => this.next());
        
        this.container.appendChild(prevBtn);
        this.container.appendChild(nextBtn);
        
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
    }
    
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        
        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
        
        this.container.parentNode.insertBefore(dotsContainer, this.container.nextSibling);
        this.dotsContainer = dotsContainer;
    }
    
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'carousel-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'carousel-progress-bar';
        progressContainer.appendChild(progressBar);
        
        this.container.parentNode.insertBefore(progressContainer, this.container.nextSibling);
        this.progressBar = progressBar;
    }
    
    setupScrollListener() {
        let scrollTimeout;
        
        this.grid.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateCurrentIndexFromScroll();
            }, 100);
        });
    }
    
    updateCurrentIndexFromScroll() {
        const scrollLeft = this.grid.scrollLeft;
        const cardWidth = this.cards[0]?.offsetWidth + 20; // Including gap
        const newIndex = Math.round(scrollLeft / cardWidth);
        
        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.cards.length) {
            this.currentIndex = newIndex;
            this.updateDots();
            this.updateNavigation();
            this.updateProgress();
        }
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateNavigation() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
            this.nextBtn.classList.toggle('disabled', this.currentIndex >= this.cards.length - 1);
        }
    }
    
    updateProgress() {
        if (this.progressBar && this.cards.length > 1) {
            const progress = ((this.currentIndex + 1) / this.cards.length) * 100;
            this.progressBar.style.width = progress + '%';
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.cards.length) return;
        
        this.currentIndex = index;
        const card = this.cards[index];
        
        if (card) {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
        
        this.updateDots();
        this.updateNavigation();
        this.updateProgress();
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }
    
    next() {
        if (this.currentIndex < this.cards.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 1230;
        
        if (!wasMobile && this.isMobile) {
            // Switched to mobile
            this.setupCarousel();
        } else if (wasMobile && !this.isMobile) {
            // Switched to desktop
            this.destroyCarousel();
        }
    }
    
    destroyCarousel() {
        if (!this.container || !this.isInitialized) return;
        
        // Remove carousel classes
        this.grid.classList.remove('carousel-mode');
        
        // Move grid back to original location
        this.container.parentNode.insertBefore(this.grid, this.container);
        
        // Remove carousel elements
        this.container.remove();
        if (this.dotsContainer) this.dotsContainer.remove();
        if (this.progressBar && this.progressBar.parentNode) {
            this.progressBar.parentNode.remove();
        }
        
        // Reset variables
        this.container = null;
        this.dots = [];
        this.currentIndex = 0;
        this.isInitialized = false;
        
        console.log('Carousel destroyed');
    }
    
    // Update carousel when filters change
    updateForFilters() {
        if (!this.isMobile || !this.isInitialized) return;
        
        this.updateCards();
        
        if (this.cards.length <= 1) {
            // Hide navigation if only one or no cards
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.dotsContainer) this.dotsContainer.style.display = 'none';
            if (this.progressBar && this.progressBar.parentNode) {
                this.progressBar.parentNode.style.display = 'none';
            }
        } else {
            // Show navigation
            if (this.prevBtn) this.prevBtn.style.display = 'flex';
            if (this.nextBtn) this.nextBtn.style.display = 'flex';
            if (this.dotsContainer) this.dotsContainer.style.display = 'flex';
            if (this.progressBar && this.progressBar.parentNode) {
                this.progressBar.parentNode.style.display = 'block';
            }
            
            // Recreate dots for new card count
            if (this.dotsContainer) {
                this.dotsContainer.innerHTML = '';
                this.dots = [];
                this.cards.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot';
                    dot.addEventListener('click', () => this.goToSlide(index));
                    this.dotsContainer.appendChild(dot);
                    this.dots.push(dot);
                });
            }
        }
        
        // Reset to first slide
        this.currentIndex = 0;
        this.updateDots();
        this.updateNavigation();
        this.updateProgress();
        
        // Scroll to beginning
        this.grid.scrollLeft = 0;
    }
    
    bindEvents() {
        // Handle resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Touch gestures for mobile
        if (this.isMobile) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            document.addEventListener('touchstart', (e) => {
                if (!this.container || !this.container.contains(e.target)) return;
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            });
            
            document.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diffX = startX - currentX;
                const threshold = 50;
                
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
                
                isDragging = false;
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing program filter...');
    window.programFilter = new ProgramFilter();
    
    // Initialize carousel
    if (window.innerWidth <= 1230) {
        window.programsCarousel = new ProgramsCarousel();
    }
});

// Fallback initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.programFilter) {
            console.log('Fallback: Initializing program filter...');
            window.programFilter = new ProgramFilter();
        }
        
        if (window.innerWidth <= 1230 && !window.programsCarousel) {
            window.programsCarousel = new ProgramsCarousel();
        }
    });
} else {
    // DOM is already loaded
    console.log('DOM already loaded, initializing program filter immediately...');
    if (!window.programFilter) {
        window.programFilter = new ProgramFilter();
    }
    
    if (window.innerWidth <= 1230 && !window.programsCarousel) {
        window.programsCarousel = new ProgramsCarousel();
    }
}

// Handle window resize for carousel
window.addEventListener('resize', () => {
    if (window.innerWidth <= 1230 && !window.programsCarousel) {
        window.programsCarousel = new ProgramsCarousel();
    } else if (window.innerWidth > 1230 && window.programsCarousel) {
        window.programsCarousel.destroyCarousel();
        window.programsCarousel = null;
    }
});

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
    console.log('Carousel instance:', !!window.programsCarousel);
    console.log('Current breakpoint (<=1230):', window.innerWidth <= 1230);
    
    if (window.programFilter) {
        console.log('Current filters:', window.programFilter.getCurrentFilters());
    }
    
    if (window.programsCarousel) {
        console.log('Carousel initialized:', window.programsCarousel.isInitialized);
        console.log('Cards in carousel:', window.programsCarousel.cards.length);
    }
};

// Export for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgramFilter, ProgramsCarousel };
}