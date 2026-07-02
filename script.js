const SKIN_STORAGE_KEY = 'site-skin';
const SKIN_REGISTRY = {
    developer: {
        label: 'Developer skin',
        href: 'skins/developer.css',
        themeColor: '#004aad'
    },
    dreamer: {
        label: 'Dreamer skin',
        href: 'skins/dreamer.css',
        themeColor: '#a31f34'
    },
    uw: {
        label: 'UW skin',
        href: 'skins/uw.css',
        themeColor: '#4b2e83'
    }
};

function getStoredSkin() {
    try {
        const storedSkin = window.localStorage.getItem(SKIN_STORAGE_KEY);
        return SKIN_REGISTRY[storedSkin] ? storedSkin : 'developer';
    } catch (error) {
        return 'developer';
    }
}

function persistSkin(skinId) {
    try {
        window.localStorage.setItem(SKIN_STORAGE_KEY, skinId);
    } catch (error) {
        // Ignore storage failures and keep the active skin in-session.
    }
}

function ensureSkinStylesheet() {
    let skinStylesheet = document.getElementById('skin-stylesheet');

    if (!skinStylesheet) {
        skinStylesheet = document.createElement('link');
        skinStylesheet.id = 'skin-stylesheet';
        skinStylesheet.rel = 'stylesheet';
        document.head.appendChild(skinStylesheet);
    }

    return skinStylesheet;
}

function updateThemeColor(themeColor) {
    const themeMeta = document.getElementById('theme-color-meta');

    if (themeMeta) {
        themeMeta.setAttribute('content', themeColor);
    }
}

function updateFavicons(skinId) {
    const faviconMap = {
        developer: {
            'favicon-ico': 'favicon.ico',
            'favicon-svg': 'favicon.svg',
            'favicon-png': 'favicon.png',
            'favicon-apple': 'apple-touch-icon.png'
        },
        dreamer: {
            'favicon-ico': 'skins/favicons/mitfavicon.ico',
            'favicon-svg': 'skins/favicons/mitfavicon.svg',
            'favicon-png': 'skins/favicons/mitfavicon.png',
            'favicon-apple': 'apple-touch-icon.png'
        },
        uw: {
            'favicon-ico': 'skins/favicons/uwfavicon.ico',
            'favicon-svg': 'skins/favicons/uwfavicon.svg',
            'favicon-png': 'skins/favicons/uwfavicon.png',
            'favicon-apple': 'apple-touch-icon.png'
        }
    };

    const activeFavicons = faviconMap[skinId] || faviconMap.developer;

    Object.entries(activeFavicons).forEach(([id, href]) => {
        const link = document.getElementById(id);
        if (link) {
            link.href = href;
        }
    });
}

function syncSkinButtons(skinId) {
    const skinButtons = document.querySelectorAll('.skin-option');
    const activeSkinLabel = document.getElementById('active-skin-label');

    skinButtons.forEach(button => {
        const isActive = button.dataset.skin === skinId;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    if (activeSkinLabel && SKIN_REGISTRY[skinId]) {
        activeSkinLabel.textContent = SKIN_REGISTRY[skinId].label;
    }
}

function applySkin(skinId, shouldPersist = true) {
    const activeSkin = SKIN_REGISTRY[skinId] ? skinId : 'developer';
    const skinStylesheet = ensureSkinStylesheet();
    const skinDetails = SKIN_REGISTRY[activeSkin];

    document.documentElement.dataset.skin = activeSkin;
    skinStylesheet.onerror = function() {
        if (activeSkin !== 'developer') {
            applySkin('developer', true);
        }
    };
    skinStylesheet.onload = null;
    skinStylesheet.href = skinDetails.href;
    updateThemeColor(skinDetails.themeColor);
    updateFavicons(activeSkin);
    syncSkinButtons(activeSkin);

    if (shouldPersist) {
        persistSkin(activeSkin);
    }

    window.__activeSkin = activeSkin;
    return activeSkin;
}

document.addEventListener('DOMContentLoaded', function() {
    applySkin(window.__initialSkin || getStoredSkin(), false);

    document.querySelectorAll('.skin-option').forEach(button => {
        button.addEventListener('click', function() {
            applySkin(this.dataset.skin, true);
        });
    });
});

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
