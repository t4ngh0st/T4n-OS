// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSidebar();
    initializeNavigation();
    initializeSubmenus();
    initializeMobileMenu();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile theme toggle
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('.theme-toggle i, .theme-toggle-mobile i');
    const iconClass = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    const oppositeIconClass = theme === 'dark' ? 'fa-moon' : 'fa-sun';
    
    icons.forEach(icon => {
        icon.classList.remove(oppositeIconClass);
        icon.classList.add(iconClass);
    });
}

// Sidebar Initialization
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    // Close sidebar when clicking on overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }
    
    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileSidebar();
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileSidebar);
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigation
function initializeNavigation() {
    const menuLinks = document.querySelectorAll('.menu-link, .sub-menu-link');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
                setActiveMenu(this);
                
                // Close mobile sidebar after navigation
                closeMobileSidebar();
            }
        });
    });
    
    // Show first section by default
    const firstSection = document.querySelector('.content-section');
    if (firstSection) {
        firstSection.classList.add('active');
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update section title
        const sectionTitle = document.getElementById('section-title');
        if (sectionTitle) {
            const menuText = document.querySelector(`[data-section="${sectionId}"] span`);
            if (menuText) {
                sectionTitle.textContent = menuText.textContent;
            }
        }
        
        // Scroll to top of content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }
}

function setActiveMenu(clickedLink) {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-link, .sub-menu-link');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item and its parents
    clickedLink.classList.add('active');
    
    // Also activate parent menu items
    let parentMenu = clickedLink.closest('li').parentElement;
    while (parentMenu && parentMenu.classList.contains('sidebar-menu')) {
        const parentLink = parentMenu.previousElementSibling;
        if (parentLink && parentLink.classList.contains('menu-link')) {
            parentLink.classList.add('active');
        }
        parentMenu = parentMenu.parentElement;
    }
}

// Submenu Toggle
function initializeSubmenus() {
    const submenuToggles = document.querySelectorAll('.has-submenu');
    
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Prevent navigation when clicking on toggle icon
            if (e.target.classList.contains('toggle-icon') || e.target.tagName === 'I') {
                e.preventDefault();
                e.stopPropagation();
                
                const submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.classList.toggle('show');
                    this.classList.toggle('active');
                }
            }
        });
    });
}

// Smooth Scrolling for Anchor Links
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

// Code Block Enhancement
function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fa fa-copy"></i>';
        copyButton.className = 'copy-button';
        copyButton.title = 'Copy to clipboard';
        
        copyButton.addEventListener('click', function() {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fa fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fa fa-copy"></i>';
                }, 2000);
            });
        });
        
        block.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0.5rem';
        copyButton.style.right = '0.5rem';
        copyButton.style.background = 'var(--primary-color)';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.padding = '0.3rem 0.6rem';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '0.8rem';
        
        block.appendChild(copyButton);
    });
}

// Initialize code block enhancement when DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);

// Search Functionality (Basic)
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search documentation...';
    searchInput.className = 'search-input';
    
    searchInput.style.width = '100%';
    searchInput.style.padding = '0.8rem';
    searchInput.style.marginBottom = '1rem';
    searchInput.style.border = '1px solid var(--border-color)';
    searchInput.style.borderRadius = '4px';
    searchInput.style.background = 'var(--bg-color)';
    searchInput.style.color = 'var(--text-color)';
    
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.appendChild(searchInput);
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterMenuItems(searchTerm);
        });
    }
}

function filterMenuItems(searchTerm) {
    const menuItems = document.querySelectorAll('.menu-link, .sub-menu-link');
    
    menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
            
            // Show parent menus
            let parent = item.closest('ul');
            while (parent && parent.classList.contains('sidebar-menu')) {
                parent.style.display = 'block';
                const parentToggle = parent.previousElementSibling;
                if (parentToggle && parentToggle.classList.contains('has-submenu')) {
                    parentToggle.style.display = 'flex';
                    parent.classList.add('show');
                }
                parent = parent.parentElement;
            }
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+K or Cmd+K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Ctrl+Shift+D or Cmd+Shift+D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleTheme();
    }
});

// Performance Optimization: Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Export functions for global access (if needed)
window.WikiApp = {
    toggleTheme,
    showSection,
    toggleMobileSidebar,
    closeMobileSidebar
};

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Wiki application error:', e.error);
});

// Service Worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
