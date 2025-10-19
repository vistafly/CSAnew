// main.js - Simplified Firebase Authentication (Login Only)
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut
} from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    alert('Firebase not configured. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global state
let currentUser = null;
let allGalleryItems = [];

// ==================== AUTHENTICATION FUNCTIONS ====================

// Auth state observer
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateUIForAuthState(user);
    
    if (user) {
        showNotification(`Welcome, ${user.displayName || user.email.split('@')[0]}`);
        showGalleryContent();
    } else {
        hideGalleryContent();
    }
});

// Update UI based on auth state
function updateUIForAuthState(user) {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (user) {
        authButtons?.classList.add('hidden');
        userInfo?.classList.remove('hidden');
        if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
    } else {
        authButtons?.classList.remove('hidden');
        userInfo?.classList.add('hidden');
    }
}

// Sign in with email and password
async function signInWithEmail(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    closeModal('loginModal');
    return userCredential.user;
}

// Sign out
async function signOutUser() {
    await signOut(auth);
    showNotification('Signed out successfully');
}

// Logo loading fix
document.addEventListener('DOMContentLoaded', () => {
    const heroLogoImg = document.querySelector('.hero-logo-image');
    
    if (heroLogoImg) {
        const testImage = new Image();
        testImage.onload = function() {
            heroLogoImg.classList.add('loaded');
        };
        testImage.onerror = function() {
            // Image failed - fallback will show automatically
        };
        testImage.src = heroLogoImg.src;
    }
});

// ==================== MODAL FUNCTIONS ====================

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms and styling
        modal.querySelectorAll('form').forEach(form => form.reset());
        modal.querySelectorAll('input').forEach(input => {
            input.style.borderColor = '#e0e0e0';
        });
    }
}

// ==================== ERROR HANDLING ====================

function handleAuthError(error) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-email': 'Invalid email address',
        'auth/network-request-failed': 'Network error - check your connection',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/user-disabled': 'This account has been disabled'
    };
    
    const message = errorMessages[error.code] || error.message || 'Authentication error occurred';
    showNotification(message, 'error');
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notificationText) notificationText.textContent = message;
    if (notification) {
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => notification.classList.remove('show'), 5000);
    }
}

// ==================== GALLERY FUNCTIONS ====================

function showGalleryContent() {
    const authRequired = document.getElementById('authRequired');
    const galleryContent = document.getElementById('galleryContent');
    
    if (authRequired) authRequired.style.display = 'none';
    if (galleryContent) {
        galleryContent.classList.remove('hidden');
        setTimeout(initializeGallery, 100);
    }
}

function hideGalleryContent() {
    const authRequired = document.getElementById('authRequired');
    const galleryContent = document.getElementById('galleryContent');
    
    if (authRequired) authRequired.style.display = 'block';
    if (galleryContent) galleryContent.classList.add('hidden');
}

function initializeGallery() {
    allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    updatePhotoCount();
    
    // Add filter event listeners
    ['programFilter', 'locationFilter', 'dateFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) filter.addEventListener('change', filterGallery);
    });
    
    const resetBtn = document.getElementById('filterReset');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

function filterGallery() {
    const filters = {
        program: document.getElementById('programFilter')?.value || 'all',
        location: document.getElementById('locationFilter')?.value || 'all',
        date: document.getElementById('dateFilter')?.value || 'all'
    };
    
    let visibleCount = 0;
    
    allGalleryItems.forEach(item => {
        const matches = Object.entries(filters).every(([key, value]) => 
            value === 'all' || item.dataset[key] === value
        );
        
        if (matches) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });
    
    const filteredPhotos = document.getElementById('filteredPhotos');
    if (filteredPhotos) filteredPhotos.textContent = visibleCount;
}

function resetFilters() {
    ['programFilter', 'locationFilter', 'dateFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) filter.value = 'all';
    });
    
    allGalleryItems.forEach(item => item.classList.remove('hidden'));
    updatePhotoCount();
}

function updatePhotoCount() {
    const total = allGalleryItems.length;
    const visible = allGalleryItems.filter(item => !item.classList.contains('hidden')).length;
    
    const totalEl = document.getElementById('totalPhotos');
    const visibleEl = document.getElementById('filteredPhotos');
    
    if (totalEl) totalEl.textContent = total;
    if (visibleEl) visibleEl.textContent = visible;
}

// ==================== NAVIGATION & UI ====================

// Header scroll effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const header = document.getElementById('header');
    
    if (!header) return;
    
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Mobile navigation
function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
            if (target) {
                const header = document.getElementById('header');
                const offset = header ? header.offsetHeight : 0;
                
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Program cards
function setupProgramCards() {
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('click', () => {
            const program = card.dataset.program;
            
            if (currentUser) {
                const filter = document.getElementById('programFilter');
                if (filter) {
                    filter.value = program || 'all';
                    filterGallery();
                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                showModal('loginModal');
                showNotification('Please sign in to view gallery', 'error');
            }
        });
    });
}

// ==================== FORM HANDLING ====================

function setupContactForm() {
    const educatorRole = document.getElementById('educatorRole');
    const formFields = document.getElementById('formFields');
    const nonEducatorMessage = document.getElementById('nonEducatorMessage');
    
    if (educatorRole) {
        educatorRole.addEventListener('change', (e) => {
            const isEducator = e.target.value === 'yes';
            
            if (formFields) {
                formFields.classList.toggle('active', isEducator);
            }
            if (nonEducatorMessage) {
                nonEducatorMessage.classList.toggle('active', e.target.value === 'no');
            }
        });
    }
}

// ==================== STATS COUNTER ====================

function startCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    element.textContent = '0';
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

function isPartiallyVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    return (rect.top < windowHeight * 0.8) && (rect.bottom > 0);
}

function initStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (statNumbers.length === 0) return;
    
    let hasAnimated = false;
    
    function checkAndAnimate() {
        if (hasAnimated) return;
        
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;
        
        if (isPartiallyVisible(statsSection)) {
            hasAnimated = true;
            
            statNumbers.forEach((element, index) => {
                const target = parseInt(element.dataset.count);
                
                setTimeout(() => {
                    startCounter(element, target);
                }, index * 200);
            });
        }
    }
    
    window.addEventListener('scroll', checkAndAnimate);
    checkAndAnimate();
    
    setTimeout(() => {
        if (!hasAnimated) {
            statNumbers.forEach((element, index) => {
                const target = parseInt(element.dataset.count);
                setTimeout(() => {
                    startCounter(element, target);
                }, index * 200);
            });
        }
    }, 3000);
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    setupMobileNav();
    setupSmoothScrolling();
    setupProgramCards();
    setupContactForm();
    
    // Initialize stats counters
    setTimeout(initStatsCounters, 100);
    
    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const galleryLoginBtn = document.getElementById('galleryLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showModal('loginModal');
        });
    }
    
    if (galleryLoginBtn) {
        galleryLoginBtn.addEventListener('click', () => showModal('loginModal'));
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', signOutUser);
    }
    
    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal.id);
        });
    });
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const submitBtn = document.getElementById('loginSubmit');
            
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            try {
                await signInWithEmail(email, password);
                showNotification('Successfully signed in!');
            } catch (error) {
                handleAuthError(error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Notification close
    const notificationClose = document.getElementById('notificationClose');
    if (notificationClose) {
        notificationClose.addEventListener('click', () => {
            document.getElementById('notification')?.classList.remove('show');
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close all modals
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                closeModal(modal.id);
            });
            
            // Close notification
            document.getElementById('notification')?.classList.remove('show');
        }
    });
});

// Also initialize counters after window load
window.addEventListener('load', () => {
    setTimeout(initStatsCounters, 500);
});

// Manual trigger for testing
window.manualStartCounters = function() {
    document.querySelectorAll('.stat-number[data-count]').forEach((element, index) => {
        const target = parseInt(element.dataset.count);
        setTimeout(() => {
            startCounter(element, target);
        }, index * 200);
    });
};