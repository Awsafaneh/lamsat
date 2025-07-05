// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links (adjusted to handle fixed header height)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('.header').offsetHeight; // Get header height
            const accessibilityToolbarOffset = document.querySelector('.accessibility-toolbar').offsetHeight; // Get toolbar height
            const totalOffset = headerOffset + accessibilityToolbarOffset + 20; // Add some extra space

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - totalOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) { // Check if elements exist
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }));

    // Header background change on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) { // Check if header exists
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerOffset = document.querySelector('.header').offsetHeight;
        const accessibilityToolbarOffset = document.querySelector('.accessibility-toolbar').offsetHeight;
        const totalOffset = headerOffset + accessibilityToolbarOffset + 20; // Include toolbar height

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - totalOffset - 50)) { // Adjusted for header and toolbar
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section's ID OR if it's the current page's HTML file
            const linkHrefBase = link.getAttribute('href').split('#')[0];
            const currentPageBase = window.location.pathname.split('/').pop();
            
            if (link.getAttribute('href') === `#${current}` || (linkHrefBase === currentPageBase && current === '')) {
                link.classList.add('active');
            }
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
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
    }

    // Dark mode functionality (only kept toggleDarkMode)
    window.toggleDarkMode = function() {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        const darkModeButton = document.querySelector('.accessibility-toolbar button i.fa-moon, .accessibility-toolbar button i.fa-sun');
        if (darkModeButton) {
            darkModeButton.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    // Initialize accessibility preferences on page load (only dark mode)
    function initAccessibility() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const darkModeButton = document.querySelector('.accessibility-toolbar button i.fa-moon');
            if (darkModeButton) darkModeButton.className = 'fas fa-sun';
        }
    }
    initAccessibility(); // Call on DOMContentLoaded

    // No notification system needed as forms are removed, but keeping the function definition for completeness if other parts of the site might use it.
    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }


    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        const speed = 200; 
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''));
            let current = 0;
            if (counter.dataset.intervalId) {
                clearInterval(parseInt(counter.dataset.intervalId));
            }

            const updateCounter = () => {
                if (current < target) {
                    current += target / speed; 
                    if (current > target) current = target; 
                    counter.textContent = '+' + Math.ceil(current);
                } else {
                    counter.textContent = '+' + target;
                    clearInterval(interval);
                }
            };
            
            const interval = setInterval(updateCounter, 1); 
            counter.dataset.intervalId = interval.toString(); 
        });
    }

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 }); 
        
        statsObserver.observe(statsSection);
    }


    // Gallery Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                    item.style.animation = 'none'; 
                }
            });
        });
    });

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(faqItem => {
                if (faqItem !== item) { 
                    faqItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });

    // Gallery Item Click Handler (Modal)
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            const tags = Array.from(this.querySelectorAll('.tag')).map(tag => tag.textContent);
            
            const modalContent = `
                <div class="gallery-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>${title}</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-image">
                                <i class="fas fa-image"></i> 
                            </div>
                            <div class="modal-info">
                                <p>${description}</p>
                                <div class="modal-tags">
                                    ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalContent);
            
            if (!document.querySelector('#modal-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'modal-styles';
                styleElement.textContent = `
                    .gallery-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        animation: fadeIn 0.3s ease;
                    }
                    
                    .modal-content {
                        background: white;
                        border-radius: 15px;
                        max-width: 600px;
                        width: 90%;
                        max-height: 80vh;
                        overflow-y: auto;
                        animation: slideInUp 0.3s ease;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }
                    
                    .modal-header {
                        padding: 1.5rem;
                        border-bottom: 1px solid var(--light-color);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .modal-header h3 {
                        margin: 0;
                        color: var(--dark-color);
                        font-weight: 600;
                    }
                    
                    .modal-close {
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #7f8c8d;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    }
                    
                    .modal-close:hover {
                        background: var(--highlight-color);
                        color: white;
                    }
                    
                    .modal-body {
                        padding: 1.5rem;
                    }
                    
                    .modal-image {
                        width: 100%;
                        height: 200px;
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        margin-bottom: 1.5rem;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }
                    
                    .modal-image i {
                        font-size: 3rem;
                        opacity: 0.8;
                    }
                    
                    .modal-info p {
                        color: #7f8c8d;
                        line-height: 1.6;
                        margin-bottom: 1.5rem;
                    }
                    
                    .modal-tags {
                        display: flex;
                        gap: 0.5rem;
                        flex-wrap: wrap;
                    }

                    body.dark-mode .modal-content {
                        background: var(--dark-card-bg);
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    }
                    body.dark-mode .modal-header {
                        border-bottom-color: var(--dark-border);
                    }
                    body.dark-mode .modal-header h3 {
                        color: var(--dark-text);
                    }
                    body.dark-mode .modal-close {
                        color: rgba(255,255,255,0.7);
                    }
                    body.dark-mode .modal-info p {
                        color: rgba(255,255,255,0.8);
                    }
                    body.dark-mode .tag {
                        background: var(--highlight-color);
                        color: white;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideInUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styleElement);
            }
            
            const modal = document.querySelector('.gallery-modal');
            const closeBtn = modal.querySelector('.modal-close');
            
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            document.addEventListener('keydown', function closeModal(e) {
                if (e.key === 'Escape' && document.querySelector('.gallery-modal')) {
                    document.querySelector('.gallery-modal').remove();
                    document.removeEventListener('keydown', closeModal);
                }
            });
        });
    });

    // Contact method click handlers (for contact.html)
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('click', function() {
            const type = this.querySelector('h3').textContent;
            const paragraphs = this.querySelectorAll('p');
            let info = '';

            if (paragraphs.length > 0) {
                info = paragraphs[0].textContent.trim();
            }
            
            if (type.includes('اتصل')) {
                window.location.href = `tel:${info.replace(/\s/g, '')}`;
            } else if (type.includes('واتساب')) {
                window.open(`https://wa.me/${info.replace(/\s/g, '')}?text=مرحباً، أريد استشارة حول خدمات الستائر والكنب`, '_blank');
            }
            // Email option is removed, so no mailto link
        });
    });

    console.log('لمسات للستائر - الموقع جاهز! 🎨');
});
