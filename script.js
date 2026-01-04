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

// Sticky header functionality
window.addEventListener('scroll', function() {
    const header = document.querySelector('.sticky-header');
    const scrollPosition = window.scrollY;
    
    // Show header when scrolled down 300px or more
    if (scrollPosition > 300) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    }
});

// Hamburger menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const menuPanel = document.querySelector('.menu-panel');
    const header = document.querySelector('.sticky-header');
    const closeMenu = document.querySelector('.close-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        menuPanel.classList.toggle('active');
        header.classList.toggle('menu-open');
    });
    
    // Close menu with the close button
    closeMenu.addEventListener('click', function() {
        hamburger.classList.remove('active');
        menuPanel.classList.remove('active');
        header.classList.remove('menu-open');
    });
    
    // Close menu when clicking on a menu link
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            menuPanel.classList.remove('active');
            header.classList.remove('menu-open');
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
