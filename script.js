// Update current date dynamically
document.addEventListener('DOMContentLoaded', function() {
    const dateSpan = document.getElementById('current-date');
    const dateSpan2 = document.getElementById('current-date-2');
    
    if (dateSpan || dateSpan2) {
        const now = new Date();
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        
        if (dateSpan) dateSpan.textContent = formattedDate;
        if (dateSpan2) dateSpan2.textContent = formattedDate;
    }
});

// Popup Modal functionality
window.addEventListener('load', function() {
    const popup = document.getElementById('popup-modal');
    if (popup) {
        // Show popup after a short delay for smooth fade-in
        setTimeout(function() {
            popup.classList.add('show');
        }, 300);
        
        // Close popup when clicking the X button
        const closeBtn = popup.querySelector('.popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                popup.classList.remove('show');
            });
        }
        
        // Close popup when clicking outside the content
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.classList.remove('show');
            }
        });
    }
});

// Hamburger menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const menuPanel = document.querySelector('.menu-panel');
    const header = document.querySelector('.sticky-header');
    const closeMenu = document.querySelector('.close-menu');
    const INACTIVITY_DELAY = 5000;
    const TOP_TRIGGER_ZONE = 80;
    let inactivityTimer = null;

    function showHeader() {
        if (header) {
            header.classList.add('visible');
        }
    }

    function hideHeader() {
        if (header) {
            header.classList.remove('visible');
            header.classList.remove('menu-open');
        }

        if (hamburger) {
            hamburger.classList.remove('active');
        }

        if (menuPanel) {
            menuPanel.classList.remove('active');
        }
    }

    function resetInactivityTimer() {
        window.clearTimeout(inactivityTimer);
        inactivityTimer = window.setTimeout(hideHeader, INACTIVITY_DELAY);
    }

    showHeader();
    resetInactivityTimer();

    document.addEventListener('mousemove', function(event) {
        if (event.clientY <= TOP_TRIGGER_ZONE) {
            showHeader();
        }

        resetInactivityTimer();
    });

    document.addEventListener('keydown', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer, { passive: true });
    document.addEventListener('touchstart', resetInactivityTimer, { passive: true });
    
    if (hamburger && menuPanel && header) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            menuPanel.classList.toggle('active');
            header.classList.toggle('menu-open');
        });
    }
    
    // Close menu with the close button
    if (closeMenu && hamburger && menuPanel && header) {
        closeMenu.addEventListener('click', function() {
            hamburger.classList.remove('active');
            menuPanel.classList.remove('active');
            header.classList.remove('menu-open');
        });
    }
    
    // Close menu when clicking on a menu link
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            if (menuPanel) {
                menuPanel.classList.remove('active');
            }
            if (header) {
                header.classList.remove('menu-open');
            }
        });
    });
    
    // Platform accordion functionality
    const platformHeaders = document.querySelectorAll('.platform-header');
    platformHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const platformItem = this.parentElement;
            platformItem.classList.toggle('active');
        });
    });
});
