// Mobile Menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Waitlist Form — Formspree (existing endpoint)
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // GA event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup', {
                'event_category': 'engagement',
                'event_label': 'email_signup'
            });
        }

        try {
            const response = await fetch('https://formspree.io/f/xjkjrrnp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    _subject: 'New GLICMACK Waitlist Signup',
                    _replyto: email
                })
            });

            if (!response.ok) throw new Error('Submission failed');

            showMessage("You're on the list! We'll be in touch.", 'success');
            emailInput.value = '';
        } catch (error) {
            showMessage('Something went wrong. Please try again.', 'error');
            console.error('Form error:', error);
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
}

// Track outbound links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'outbound',
                'event_label': link.href,
                'transport_type': 'beacon'
            });
        }
    });
});

// Scroll-reveal for cards
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.status-card, .approach-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// GA page view
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
}
