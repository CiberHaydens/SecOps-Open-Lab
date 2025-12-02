// Enhanced JavaScript for SecureMail Threat Automation Website

class SecureMailWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupNavbarHighlight();
        this.setupInteractiveElements();
        this.setupParallaxEffects();
        this.setupMobileMenu();
        this.setupThemeToggle();
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    const offset = 80; // Account for sticky navbar
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                    
                    // Update active nav state
                    this.updateActiveNav(this.getAttribute("href"));
                }
            });
        });
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Stagger animation for multiple elements
                    const children = entry.target.querySelectorAll('.feature-card, .component-card, .automation-item, .wazuh-feature');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all sections with fade-in class
        document.querySelectorAll('.fade-in-section').forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'all 0.6s ease-out';
            section.classList.add('visible');
            observer.observe(section);
        });
    }

    // Navbar active state highlighting
    setupNavbarHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const highlightNav = () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', highlightNav);
        highlightNav(); // Initial call
    }

    // Interactive elements and micro-interactions
    setupInteractiveElements() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add hover effects to cards
        document.querySelectorAll('.feature-card, .component-card, .automation-item, .wazuh-feature').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add typing effect to hero title
        this.typeWriter();
    }

    // Parallax scrolling effects
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-visual');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        // Create mobile menu toggle if needed
        if (window.innerWidth <= 768) {
            const navbar = document.querySelector('.navbar .container');
            const menuToggle = document.createElement('button');
            menuToggle.classList.add('menu-toggle');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            navbar.insertBefore(menuToggle, navbar.firstChild);
            
            menuToggle.addEventListener('click', () => {
                navbar.classList.toggle('menu-open');
                menuToggle.innerHTML = navbar.classList.contains('menu-open') ? '✕' : '☰';
            });
        }
    }

    // Theme toggle functionality
    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.classList.add('theme-toggle');
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(themeToggle);

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Typing effect for hero title
    typeWriter() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (!heroTitle) return;
        
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let index = 0;
        const typeSpeed = 100;
        
        const type = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(type, typeSpeed);
            }
        };
        
        setTimeout(type, 500);
    }

    // Update active navigation
    updateActiveNav(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Add loading animation
    addLoadingAnimation() {
        const loader = document.createElement('div');
        loader.classList.add('page-loader');
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => loader.remove(), 500);
            }, 100);
        });
    }

    // Add scroll progress indicator
    addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.classList.add('scroll-progress');
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }

    // Add back to top button
    addBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.classList.add('back-to-top');
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Animate number counting
    animateNumber(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateNumber = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        
        updateNumber();
    }
};

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new SecureMailWebsite();
    
    // Add additional features
    website.addLoadingAnimation();
    website.addScrollProgress();
    website.addBackToTop();
    
    // Add CSS for dynamic elements
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: var(--secondary) !important;
            background: rgba(255, 204, 0, 0.1) !important;
        }
        
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .page-loader.fade-out {
            opacity: 0;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--gradient-alt);
            z-index: 9998;
            transition: width 0.1s ease;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gradient);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 87, 255, 0.3);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 87, 255, 0.4);
        }
        
        .theme-toggle {
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            background: var(--dark);
            color: white;
            border: 2px solid var(--border);
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .menu-toggle {
            display: none;
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 18px;
        }
        
        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
            
            .navbar .container {
                flex-direction: column;
                gap: 15px;
            }
            
            .navbar .container:not(.menu-open) .nav-link {
                display: none;
            }
            
            .navbar .container.menu-open .nav-link {
                display: block;
                width: 100%;
                text-align: center;
                padding: 10px;
            }
        }
        
        body.dark-theme {
            --light: #1a202c;
            --text: #e2e8f0;
            --text-light: #a0aec0;
            --border: #2d3748;
            --shadow: rgba(0, 0, 0, 0.3);
        }
        
        body.dark-theme .feature-card,
        body.dark-theme .component-card,
        body.dark-theme .automation-item,
        body.dark-theme .wazuh-feature,
        body.dark-theme .step,
        body.dark-theme .timeline-content {
            background: #2d3748;
            border-color: #4a5568;
        }
        
        body.dark-theme .workflow-flow {
            background: linear-gradient(135deg, #2d3748, #1a202c);
        }
    `;
    document.head.appendChild(dynamicStyles);
});

// Performance optimization with debounced scroll events
window.addEventListener('scroll', utils.debounce(() => {
    // Scroll-based optimizations can go here
}, 100));
