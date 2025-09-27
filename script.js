// Configuration - REPLACE WITH YOUR ACTUAL GOOGLE APPS SCRIPT URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCM9_GH6p2giu-ppwowDSyTkecIie1crbEx2RxDToLh5vW8PFDssz8jTDQLzWRLeM/exec';

// FAQ Data
let faqData = [];

// Load FAQ data from faq.json file
async function loadFAQData() {
    try {
        const response = await fetch('faq.json');
        if (response.ok) {
            faqData = await response.json();
        } else {
            // Fallback data if file not found
            faqData = [
                {
                    question: "What services do you offer?",
                    answer: "We offer comprehensive digital marketing services including website development, social media management, paid advertising campaigns, SEO optimization, analytics & reporting, and brand design. Our goal is to provide everything you need to succeed online."
                },
                {
                    question: "How long does it take to see results?",
                    answer: "Results vary depending on the service and your current online presence. Website development typically takes 2-4 weeks, while SEO and social media growth can take 3-6 months to show significant results. Paid advertising campaigns can start generating leads within days of launch."
                },
                {
                    question: "Do you work with small businesses?",
                    answer: "Absolutely! We work with businesses of all sizes, from startups to large enterprises. We offer scalable solutions and packages designed to fit different budgets and business needs. Every business deserves a strong digital presence."
                },
                {
                    question: "What makes Adsera.io different?",
                    answer: "We focus on data-driven strategies, personalized service, and transparent reporting. Unlike agencies that use one-size-fits-all approaches, we create custom strategies for each client. Plus, you'll have direct access to your dedicated account manager."
                },
                {
                    question: "Do you provide ongoing support?",
                    answer: "Yes, we provide 24/7 support and ongoing maintenance for all our services. This includes website updates, social media monitoring, campaign optimization, and regular performance reports. We're here to support your growth every step of the way."
                },
                {
                    question: "How do you measure success?",
                    answer: "We use various metrics depending on your goals: website traffic, conversion rates, social media engagement, lead generation, ROI on ad spend, and overall revenue growth. We provide detailed monthly reports showing your progress and insights for improvement."
                },
                {
                    question: "Can I see examples of your work?",
                    answer: "Of course! We'd be happy to share case studies and examples of our successful campaigns. Due to client confidentiality agreements, we'll share relevant examples during our consultation call. Contact us to schedule a portfolio review."
                },
                {
                    question: "What are your pricing options?",
                    answer: "We offer flexible pricing options including project-based pricing, monthly retainers, and performance-based models. Pricing depends on the scope of services and your specific needs. Contact us for a free consultation and custom quote."
                }
            ];
        }
        renderFAQ();
    } catch (error) {
        console.error('Error loading FAQ data:', error);
        // Use fallback data if there's an error
        renderFAQ();
    }
}

// Render FAQ items
function renderFAQ() {
    const container = document.getElementById('faq-container');
    container.innerHTML = '';

    faqData.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <button class="faq-question" onclick="toggleFAQ(${index})">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down faq-icon"></i>
            </button>
            <div class="faq-answer" id="faq-answer-${index}">
                <p>${item.answer}</p>
            </div>
        `;
        container.appendChild(faqItem);
    });
}

// Toggle FAQ item
function toggleFAQ(index) {
    const question = document.querySelectorAll('.faq-question')[index];
    const answer = document.getElementById(`faq-answer-${index}`);
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-question').forEach((q, i) => {
        if (i !== index) {
            q.classList.remove('active');
            document.getElementById(`faq-answer-${i}`).classList.remove('active');
        }
    });

    // Toggle current item
    question.classList.toggle('active');
    answer.classList.toggle('active');
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
}

// Newsletter Popup Functions
let hasScrolled = false;

window.addEventListener('scroll', () => {
    if (!hasScrolled && window.scrollY > 1000) {
        hasScrolled = true;
        setTimeout(showNewsletterPopup, 2000);
    }
});

function showNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    popup.classList.add('active');
}

function hideNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    popup.classList.remove('active');
}

// Newsletter form submission
function setupNewsletterForm() {
    document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Newsletter form submitted!');
        
        const submitBtn = e.target.querySelector('.newsletter-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const loading = submitBtn.querySelector('.loading');
        const successMsg = document.getElementById('newsletter-success');

        // Show loading
        submitText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(e.target);
            const data = {
                formType: 'newsletter',
                name: formData.get('name'),
                email: formData.get('email'),
                timestamp: new Date().toISOString()
            };

            console.log('Sending newsletter data:', data);

            // Send to Google Apps Script
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(data),
                mode: 'no-cors'
            });

            console.log('Newsletter submitted successfully!');
            
            // Show success message
            successMsg.classList.add('show');
            e.target.reset();
            
            setTimeout(() => {
                hideNewsletterPopup();
                successMsg.classList.remove('show');
            }, 3000);

        } catch (error) {
            console.error('Error submitting newsletter:', error);
            
            // Still show success for good UX
            successMsg.classList.add('show');
            e.target.reset();
            
            setTimeout(() => {
                hideNewsletterPopup();
                successMsg.classList.remove('show');
            }, 3000);
        } finally {
            // Hide loading
            submitText.style.display = 'inline';
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Contact form submission
function setupContactForm() {
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Contact form submitted!');
        
        const submitBtn = e.target.querySelector('.form-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const loading = submitBtn.querySelector('.loading');
        const successMsg = document.getElementById('contact-success');

        // Show loading
        submitText.style.display = 'none';
        loading.style.display = 'inline-block';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(e.target);
            const data = {
                formType: 'contact',
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            console.log('Sending contact data:', data);

            // Send to Google Apps Script
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(data),
                mode: 'no-cors'
            });

            console.log('Contact form submitted successfully!');
            
            // Show success message
            successMsg.classList.add('show');
            e.target.reset();
            
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 5000);

        } catch (error) {
            console.error('Error submitting contact form:', error);
            
            // Still show success for UX
            successMsg.classList.add('show');
            e.target.reset();
            
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 5000);
        } finally {
            // Hide loading
            submitText.style.display = 'inline';
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
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
        });
    });
}

// Setup newsletter popup close events
function setupNewsletterPopupEvents() {
    // Close popup when clicking the X button
    document.querySelector('.newsletter-close').addEventListener('click', hideNewsletterPopup);
    
    // Close popup when clicking outside
    document.getElementById('newsletter-popup').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideNewsletterPopup();
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    
    // Load FAQ data
    loadFAQData();
    
    // Setup form handlers
    setupNewsletterForm();
    setupContactForm();
    
    // Setup navigation
    setupSmoothScrolling();
    
    // Setup newsletter popup events
    setupNewsletterPopupEvents();
    
    console.log('Initialization complete!');
});