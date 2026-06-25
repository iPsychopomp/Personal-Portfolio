// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile menu after clicking
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Auto-changing subtitle
const subtitles = [
    "Building digital experiences one line of code at a time",
    "Aspiring Game & Full-Stack Developer",
    "IT Student & Web Developer",
    "Creating efficient and practical solutions",
    "Passionate about learning new technologies",
    "Exploring AI integration in development"
];

let currentSubtitleIndex = 0;
const subtitleElement = document.getElementById('changing-subtitle');

function changeSubtitle() {
    if (subtitleElement) {
        // Fade out
        subtitleElement.style.opacity = '0';
        
        setTimeout(() => {
            // Change text
            currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitles.length;
            subtitleElement.textContent = subtitles[currentSubtitleIndex];
            
            // Fade in
            subtitleElement.style.opacity = '1';
        }, 300);
    }
}

// Change subtitle every 3 seconds (3000ms)
if (subtitleElement) {
    setInterval(changeSubtitle, 3000);
}

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Theme toggle
const themeCheckbox = document.querySelector('.theme-checkbox');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeCheckbox.checked = true;
}

themeCheckbox.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    
    // Save theme preference
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        } else {
            entry.target.classList.remove('animate-in');
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.about, .projects, .certifications, .contact').forEach(section => {
    section.classList.add('fade-slide-up');
    observer.observe(section);
});

// Observe cards with stagger effect
document.querySelectorAll('.about-card').forEach((card, index) => {
    card.classList.add('stagger-item');
    card.style.animationDelay = `${index * 0.2}s`;
    observer.observe(card);
});

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.classList.add('stagger-item');
    card.style.animationDelay = `${index * 0.2}s`;
    observer.observe(card);
});

document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.classList.add('stagger-item');
    card.style.animationDelay = `${index * 0.2}s`;
    observer.observe(card);
});

// About image scale animation
const aboutImage = document.querySelector('.about-image');
if (aboutImage) {
    aboutImage.classList.add('scale-up');
    observer.observe(aboutImage);
}

// Carousel Navigation
function scrollCarousel(section, direction) {
    const carousel = document.getElementById(`${section}-carousel`);
    const cardWidth = carousel.querySelector('.project-card, .certifications-card').offsetWidth;
    const gap = 32; // 2rem gap
    const scrollAmount = (cardWidth + gap) * direction;
    
    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Navbar hide/show on scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past 100px
            navbar.classList.add('hidden');
            navbar.classList.remove('visible');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 10);
});

// Toast Notification System with Max Toast Limit
let activeToasts = [];
const MAX_TOASTS = 3; // Industry standard: max 3 toasts at once

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    // Remove oldest toast if we have too many
    if (activeToasts.length >= MAX_TOASTS) {
        const oldestToast = activeToasts[0];
        oldestToast.classList.add('fade-out');
        setTimeout(() => oldestToast.remove(), 300);
        activeToasts.shift();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Toast content
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : '✗'}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="closeToast(this)">×</button>
        <div class="toast-progress"></div>
    `;
    
    // Add to container and track it
    toastContainer.appendChild(toast);
    activeToasts.push(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
                activeToasts = activeToasts.filter(t => t !== toast);
            }, 300);
        }
    }, 4000);
}

// Close toast manually
function closeToast(button) {
    const toast = button.parentElement;
    toast.classList.add('fade-out');
    setTimeout(() => {
        toast.remove();
        activeToasts = activeToasts.filter(t => t !== toast);
    }, 300);
}

// Contact Form Handler with Formspree
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;
        
        try {
            // Send to Formspree
            const response = await fetch('https://formspree.io/f/xzdwqjgn', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            if (response.ok) {
                // Success - Show toast and clear form
                showToast("Message sent successfully! I'll get back to you soon.", 'success');
                contactForm.reset(); // Clear the form fields
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error - Show error toast
            showToast('Oops! Something went wrong. Please try again or email me directly.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Copy Email with Rate Limiting (Anti-Spam)
let lastCopyTime = 0;
const COPY_COOLDOWN = 2000; // 2 seconds cooldown between copies

function copyEmail() {
    const now = Date.now();
    
    // Check if we're still in cooldown period (spam prevention)
    if (now - lastCopyTime < COPY_COOLDOWN) {
        // Silently ignore spam clicks
        return;
    }
    
    lastCopyTime = now;
    const email = 'bestudiobrian@gmail.com';
    
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(() => {
        // Show success toast
        showToast('Email copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy email:', err);
        // Fallback: show alert
        alert('Email: bestudiobrian@gmail.com');
    });
}
