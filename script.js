// script.js 
// Firebase Configuration and Initialization
let firebaseConfig = {};
let auth = null;
let currentUser = null;

// Load Firebase configuration from environment or fallback
function getFirebaseConfig() {
    console.log('Loading Firebase configuration...');
    
    // Method 1: Check for global config (from config.js)
    if (typeof window !== 'undefined' && window.FIREBASE_CONFIG) {
        console.log('Using config.js configuration');
        return window.FIREBASE_CONFIG;
    }
    
    // Method 2: Using build-time environment variables (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) {
        console.log('Using Vite environment variables');
        return {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID
        };
    }
    
    // Method 3: Using webpack/create-react-app environment variables
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_FIREBASE_API_KEY) {
        console.log('Using React/Webpack environment variables');
        return {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
        };
    }
    
    console.error('No Firebase configuration found!');
    console.error('Please create a config.js file or set up environment variables.');
    return null;
}

// Initialize Firebase
async function initializeFirebase() {
    try {
        console.log('Initializing Firebase...');
        
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK not loaded. Check that Firebase scripts are included.');
        }
        
        firebaseConfig = getFirebaseConfig();
        
        if (!firebaseConfig) {
            throw new Error('Firebase configuration not found. Please check your config.js file or environment variables.');
        }
        
        // Validate configuration
        const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
        const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field].includes('your-') || firebaseConfig[field].includes('YOUR_'));
        
        if (missingFields.length > 0) {
            throw new Error(`Firebase configuration incomplete. Missing or placeholder values for: ${missingFields.join(', ')}`);
        }
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        
        console.log('Firebase initialized successfully');
        console.log('Project ID:', firebaseConfig.projectId);
        
        // Set up auth state listener
        auth.onAuthStateChanged(handleAuthStateChange);
        
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        showNotification(`Authentication Error: ${error.message}`, 'error');
        
        // Show debug info in console
        console.log('Debug Info:');
        console.log('- Firebase SDK loaded:', typeof firebase !== 'undefined');
        console.log('- Window.FIREBASE_CONFIG exists:', typeof window.FIREBASE_CONFIG !== 'undefined');
        console.log('- Current config:', firebaseConfig);
    }
}

// Handle authentication state changes
function handleAuthStateChange(user) {
    currentUser = user;
    updateUIForAuthState(user);
    
    if (user) {
        console.log('User signed in:', user.email);
        showNotification(`Welcome back, ${user.displayName || user.email}!`);
        showGalleryContent();
    } else {
        console.log('User signed out');
        hideGalleryContent();
    }
}

// Update UI based on authentication state
function updateUIForAuthState(user) {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (user) {
        // User is signed in
        if (authButtons) authButtons.classList.add('hidden');
        if (userInfo) userInfo.classList.remove('hidden');
        if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
    } else {
        // User is signed out
        if (authButtons) authButtons.classList.remove('hidden');
        if (userInfo) userInfo.classList.add('hidden');
    }
}

// Show/Hide gallery content based on auth state
function showGalleryContent() {
    const authRequired = document.getElementById('authRequired');
    const galleryContent = document.getElementById('galleryContent');
    
    if (authRequired) authRequired.style.display = 'none';
    if (galleryContent) {
        galleryContent.classList.remove('hidden');
        // Initialize gallery after showing content
        setTimeout(initializeGallery, 100);
    }
}

function hideGalleryContent() {
    const authRequired = document.getElementById('authRequired');
    const galleryContent = document.getElementById('galleryContent');
    
    if (authRequired) authRequired.style.display = 'block';
    if (galleryContent) galleryContent.classList.add('hidden');
}

// Authentication functions
async function signInWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        closeModal('loginModal');
        return userCredential.user;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}

async function signUpWithEmail(email, password, displayName) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update user profile with display name
        if (displayName) {
            await userCredential.user.updateProfile({
                displayName: displayName
            });
        }
        
        closeModal('registerModal');
        return userCredential.user;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
}

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        closeModal('loginModal');
        return result.user;
    } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
    }
}

async function signOut() {
    try {
        await auth.signOut();
        showNotification('You have been signed out successfully');
    } catch (error) {
        console.error('Sign out error:', error);
        showNotification('Error signing out', 'error');
    }
}

async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showNotification('Password reset email sent! Check your inbox.');
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
}

// Modal functions
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
        
        // Clear form data
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Clear any error styling
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '#e0e0e0';
        });
    }
}

// DOM Elements
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const educatorRole = document.getElementById('educatorRole');
const formFields = document.getElementById('formFields');
const nonEducatorMessage = document.getElementById('nonEducatorMessage');
const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const notificationClose = document.getElementById('notificationClose');

// Gallery Elements
const programFilter = document.getElementById('programFilter');
const locationFilter = document.getElementById('locationFilter');
const dateFilter = document.getElementById('dateFilter');
const filterReset = document.getElementById('filterReset');
const galleryGrid = document.getElementById('galleryGrid');
const totalPhotos = document.getElementById('totalPhotos');
const filteredPhotos = document.getElementById('filteredPhotos');

// Gallery functionality
let allGalleryItems = [];

function initializeGallery() {
    allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    updatePhotoCount();
    
    // Add event listeners for filters
    if (programFilter) programFilter.addEventListener('change', filterGallery);
    if (locationFilter) locationFilter.addEventListener('change', filterGallery);
    if (dateFilter) dateFilter.addEventListener('change', filterGallery);
    if (filterReset) filterReset.addEventListener('click', resetFilters);
}

function filterGallery() {
    const programValue = programFilter ? programFilter.value : 'all';
    const locationValue = locationFilter ? locationFilter.value : 'all';
    const dateValue = dateFilter ? dateFilter.value : 'all';
    
    let visibleCount = 0;
    
    allGalleryItems.forEach(item => {
        const itemProgram = item.dataset.program;
        const itemLocation = item.dataset.location;
        const itemDate = item.dataset.date;
        
        const programMatch = programValue === 'all' || itemProgram === programValue;
        const locationMatch = locationValue === 'all' || itemLocation === locationValue;
        const dateMatch = dateValue === 'all' || itemDate === dateValue;
        
        if (programMatch && locationMatch && dateMatch) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Update filtered count with animation
    if (filteredPhotos) {
        animateNumber(filteredPhotos, visibleCount, 300);
    }
    
    // Add stagger effect to visible items
    const visibleItems = allGalleryItems.filter(item => !item.classList.contains('hidden'));
    visibleItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
        }, index * 50);
    });
}

function resetFilters() {
    if (programFilter) programFilter.value = 'all';
    if (locationFilter) locationFilter.value = 'all';
    if (dateFilter) dateFilter.value = 'all';
    
    allGalleryItems.forEach(item => {
        item.classList.remove('hidden');
    });
    
    updatePhotoCount();
    
    // Add bounce effect to reset
    if (filterReset) {
        filterReset.style.transform = 'scale(0.95)';
        setTimeout(() => {
            filterReset.style.transform = 'scale(1)';
        }, 150);
    }
}

function updatePhotoCount() {
    const total = allGalleryItems.length;
    const visible = allGalleryItems.filter(item => !item.classList.contains('hidden')).length;
    
    if (totalPhotos) totalPhotos.textContent = total;
    if (filteredPhotos) filteredPhotos.textContent = visible;
}

function animateNumber(element, target, duration = 500) {
    const start = parseInt(element.textContent) || 0;
    const range = target - start;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const current = Math.round(start + (range * easeOutQuart));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Header scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class when user scrolls down
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Mobile navigation toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Authentication Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    initializeFirebase();
    
    // Login button in navigation
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => showModal('loginModal'));
    }
    
    // Gallery login button
    const galleryLoginBtn = document.getElementById('galleryLoginBtn');
    if (galleryLoginBtn) {
        galleryLoginBtn.addEventListener('click', () => showModal('loginModal'));
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', signOut);
    }
    
    // Modal close buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal when clicking overlay
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const submitBtn = document.getElementById('loginSubmit');
            
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            try {
                await signInWithEmail(email, password);
            } catch (error) {
                handleAuthError(error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            try {
                await signUpWithEmail(email, password, name);
                showNotification('Account created successfully!');
            } catch (error) {
                handleAuthError(error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Google sign in
    const googleSignInBtn = document.getElementById('googleSignIn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            const originalText = googleSignInBtn.textContent;
            googleSignInBtn.textContent = 'Signing In...';
            googleSignInBtn.disabled = true;
            
            try {
                await signInWithGoogle();
            } catch (error) {
                handleAuthError(error);
            } finally {
                googleSignInBtn.textContent = originalText;
                googleSignInBtn.disabled = false;
            }
        });
    }
    
    // Show register modal
    const showRegisterBtn = document.getElementById('showRegister');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            setTimeout(() => showModal('registerModal'), 300);
        });
    }
    
    // Show login modal
    const showLoginBtn = document.getElementById('showLogin');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            setTimeout(() => showModal('loginModal'), 300);
        });
    }
    
    // Forgot password
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            
            if (!email) {
                showNotification('Please enter your email address first', 'error');
                return;
            }
            
            try {
                await resetPassword(email);
                closeModal('loginModal');
            } catch (error) {
                handleAuthError(error);
            }
        });
    }
});

// Handle authentication errors
function handleAuthError(error) {
    let message = 'An error occurred during authentication';
    
    switch (error.code) {
        case 'auth/user-not-found':
            message = 'No account found with this email address';
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password';
            break;
        case 'auth/email-already-in-use':
            message = 'An account with this email already exists';
            break;
        case 'auth/weak-password':
            message = 'Password is too weak';
            break;
        case 'auth/invalid-email':
            message = 'Invalid email address';
            break;
        case 'auth/popup-closed-by-user':
            message = 'Sign-in was cancelled';
            break;
        case 'auth/network-request-failed':
            message = 'Network error. Please check your connection';
            break;
        default:
            message = error.message || message;
    }
    
    showNotification(message, 'error');
}

// Educator role selection
if (educatorRole) {
    educatorRole.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if (value === 'yes') {
            if (formFields) formFields.classList.add('active');
            if (nonEducatorMessage) nonEducatorMessage.classList.remove('active');
        } else if (value === 'no') {
            if (formFields) formFields.classList.remove('active');
            if (nonEducatorMessage) nonEducatorMessage.classList.add('active');
        } else {
            if (formFields) formFields.classList.remove('active');
            if (nonEducatorMessage) nonEducatorMessage.classList.remove('active');
        }
    });
}

// Form validation
function validateForm() {
    const requiredFields = [
        'firstName',
        'lastName', 
        'email',
        'school',
        'position'
    ];
    
    let isValid = true;
    const errors = [];
    
    // Check if educator role is selected
    if (!educatorRole || educatorRole.value !== 'yes') {
        showNotification('Please confirm you are an educator to access the form.', 'error');
        return false;
    }
    
    // Validate required fields
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const value = field.value.trim();
            
            if (!value) {
                field.style.borderColor = '#f44336';
                errors.push(`${field.previousElementSibling.textContent.replace(' *', '')} is required`);
                isValid = false;
            } else {
                field.style.borderColor = '#e0e0e0';
            }
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField) {
        const emailValue = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailValue && !emailRegex.test(emailValue)) {
            emailField.style.borderColor = '#f44336';
            errors.push('Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Show validation errors
    if (!isValid) {
        showNotification(errors[0], 'error');
    }
    
    return isValid;
}

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Thank you! We\'ll contact you within 24 hours to discuss your school\'s needs.');
            
            // Reset form
            contactForm.reset();
            if (formFields) formFields.classList.remove('active');
            if (nonEducatorMessage) nonEducatorMessage.classList.remove('active');
            
            // Clear any error styling
            document.querySelectorAll('input, select, textarea').forEach(field => {
                field.style.borderColor = '#e0e0e0';
            });
            
        } catch (error) {
            showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Real-time form field validation
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.style.borderColor = '#f44336';
        } else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            field.style.borderColor = emailRegex.test(field.value.trim()) ? '#e0e0e0' : '#f44336';
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    field.addEventListener('input', () => {
        if (field.style.borderColor === 'rgb(244, 67, 54)') {
            field.style.borderColor = '#e0e0e0';
        }
    });
});

// Notification system
function showNotification(message, type = 'success') {
    if (notificationText) notificationText.textContent = message;
    if (notification) {
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification();
        }, 5000);
    }
}

function hideNotification() {
    if (notification) notification.classList.remove('show');
}

// Close notification manually
if (notificationClose) {
    notificationClose.addEventListener('click', hideNotification);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Animated counter for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(counter);
        } else {
            element.textContent = target;
        }
    };
    
    counter();
}

// Stats counter observer
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target;
            const target = parseInt(numberElement.dataset.count);
            
            if (target) {
                animateCounter(numberElement, target);
                statsObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

// Image error handling for logo and gallery
document.addEventListener('DOMContentLoaded', () => {
    // Handle logo image errors
    const logoImages = document.querySelectorAll('.logo-image, .hero-logo-image');
    logoImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && (fallback.classList.contains('logo-fallback') || fallback.classList.contains('hero-logo-fallback'))) {
                fallback.style.display = 'flex';
            }
        });
        
        img.addEventListener('load', function() {
            const fallback = this.nextElementSibling;
            if (fallback && (fallback.classList.contains('logo-fallback') || fallback.classList.contains('hero-logo-fallback'))) {
                fallback.style.display = 'none';
            }
        });
    });
    
    // Handle gallery image errors
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('error', function() {
            const galleryItem = this.closest('.gallery-item');
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%; 
                height: 250px; 
                background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
                text-align: center;
            `;
            placeholder.innerHTML = 'Image<br>Coming Soon';
            
            this.parentNode.replaceChild(placeholder, this);
        });
    });
    
    // Observe elements for animations
    const fadeElements = document.querySelectorAll('.program-card, .testimonial-card, .stat-item, .gallery-item');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Program card interactions
document.addEventListener('DOMContentLoaded', () => {
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        card.addEventListener('click', () => {
            const program = card.dataset.program;
            // Only navigate to gallery if user is authenticated
            if (currentUser) {
                // Filter gallery to show this program
                if (programFilter) {
                    programFilter.value = program || 'all';
                    filterGallery();
                    
                    // Scroll to gallery
                    const gallerySection = document.getElementById('gallery');
                    if (gallerySection) {
                        gallerySection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            } else {
                // Show authentication modal
                showModal('loginModal');
                showNotification('Please sign in to view gallery content', 'error');
            }
        });
    });
    
    // Gallery item click for lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Could add lightbox/modal functionality here
            const img = item.querySelector('img');
            const info = item.querySelector('.gallery-info');
            if (img && info) {
                console.log('Clicked gallery item:', {
                    src: img.src,
                    title: info.querySelector('h4')?.textContent,
                    description: info.querySelector('p')?.textContent
                });
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close modals
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(modal => {
            closeModal(modal.id);
        });
        
        // Close notification
        if (notification && notification.classList.contains('show')) {
            hideNotification();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Prevent form submission on Enter in text inputs (except textarea)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
        e.preventDefault();
        
        // Move to next form field
        const form = e.target.closest('form');
        if (form) {
            const formElements = Array.from(form.querySelectorAll('input, select, textarea, button'));
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement) {
                nextElement.focus();
            }
        }
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial states
    if (formFields) formFields.classList.remove('active');
    if (nonEducatorMessage) nonEducatorMessage.classList.remove('active');
    
    // Add loading class to body and remove after page load
    document.body.classList.add('loading');
    
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });
});