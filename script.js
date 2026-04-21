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

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;
        
        try {
            // Using FormSubmit.co - a free form backend service
            // Replace with your own email or use a different service
            const response = await fetch('https://formsubmit.co/ajax/bestudiobrian@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `Portfolio Contact from ${name}`,
                    _template: 'table'
                })
            });
            
            if (response.ok) {
                formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.textContent = '✗ Oops! Something went wrong. Please email me directly at bestudiobrian@gmail.com';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    });
}
