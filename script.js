const SKIN_STORAGE_KEY = 'site-skin';
const SKIN_PROMPT_DELAY = 3000;
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
    },
    'argentina-gano': {
        label: 'Argentina Gano skin',
        href: 'skins/argentina-gano.css',
        themeColor: '#75aadb'
    },
    'espana-gano': {
        label: 'Espana Gano skin',
        href: 'skins/espana-gano.css',
        themeColor: '#c60b1e'
    },
    'england-won': {
        label: 'England Won skin',
        href: 'skins/england-won.css',
        themeColor: '#cf142b'
    },
    'la-france-a-gagne': {
        label: 'La France a Gagné skin',
        href: 'skins/la-france-a-gagne.css',
        themeColor: '#002395'
    }
};

let skinPromptTimer = null;
let skinPromptButton = null;

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

function hasStoredSkinPreference() {
    try {
        return window.localStorage.getItem(SKIN_STORAGE_KEY) !== null;
    } catch (error) {
        return false;
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
        },
        'la-france-a-gagne': {
            'favicon-ico': 'skins/favicons/francefavicon.png',
            'favicon-svg': 'skins/favicons/francefavicon.png',
            'favicon-png': 'skins/favicons/francefavicon.png',
            'favicon-apple': 'skins/favicons/francefavicon.png'
        },
        'argentina-gano': {
            'favicon-ico': 'skins/favicons/argentinafavicon.png',
            'favicon-svg': 'skins/favicons/argentinafavicon.png',
            'favicon-png': 'skins/favicons/argentinafavicon.png',
            'favicon-apple': 'skins/favicons/argentinafavicon.png'
        },
        'espana-gano': {
            'favicon-ico': 'skins/favicons/spainfavicon.png',
            'favicon-svg': 'skins/favicons/spainfavicon.png',
            'favicon-png': 'skins/favicons/spainfavicon.png',
            'favicon-apple': 'skins/favicons/spainfavicon.png'
        },
        'england-won': {
            'favicon-ico': 'skins/favicons/englandfavicon.png',
            'favicon-svg': 'skins/favicons/englandfavicon.png',
            'favicon-png': 'skins/favicons/englandfavicon.png',
            'favicon-apple': 'skins/favicons/englandfavicon.png'
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

function clearSkinPrompt() {
    window.clearTimeout(skinPromptTimer);
    skinPromptTimer = null;

    if (skinPromptButton) {
        skinPromptButton.classList.remove('is-shaking');
        skinPromptButton = null;
    }
}

function startSkinPrompt() {
    clearSkinPrompt();

    if (hasStoredSkinPreference()) {
        return;
    }

    const skinButtons = Array.from(document.querySelectorAll('.skin-option'));

    skinPromptTimer = window.setTimeout(function() {
        const availableButtons = skinButtons.filter(button => button.dataset.skin !== window.__activeSkin);

        if (!availableButtons.length || hasStoredSkinPreference()) {
            return;
        }

        skinPromptButton = availableButtons[Math.floor(Math.random() * availableButtons.length)];
        skinPromptButton.classList.add('is-shaking');
    }, SKIN_PROMPT_DELAY);
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

const ENGLAND_QUIZ_PASSED_KEY = 'england-quiz-passed';
const FRANCE_QUIZ_PASSED_KEY = 'france-quiz-passed';
const ARGENTINA_QUIZ_PASSED_KEY = 'argentina-quiz-passed';

function hasPassedEnglandQuiz() {
    try {
        return window.localStorage.getItem(ENGLAND_QUIZ_PASSED_KEY) === 'true';
    } catch (error) {
        return false;
    }
}

function markEnglandQuizPassed() {
    try {
        window.localStorage.setItem(ENGLAND_QUIZ_PASSED_KEY, 'true');
    } catch (error) {
    }
}

function hasPassedArgentinaQuiz() {
    try {
        return window.localStorage.getItem(ARGENTINA_QUIZ_PASSED_KEY) === 'true';
    } catch (error) {
        return false;
    }
}

function markArgentinaQuizPassed() {
    try {
        window.localStorage.setItem(ARGENTINA_QUIZ_PASSED_KEY, 'true');
    } catch (error) {
    }
}

function hasPassedFranceQuiz() {
    try {
        return window.localStorage.getItem(FRANCE_QUIZ_PASSED_KEY) === 'true';
    } catch (error) {
        return false;
    }
}

function markFranceQuizPassed() {
    try {
        window.localStorage.setItem(FRANCE_QUIZ_PASSED_KEY, 'true');
    } catch (error) {
    }
}

document.addEventListener('DOMContentLoaded', function() {
    applySkin(window.__initialSkin || getStoredSkin(), false);

    startSkinPrompt();

    document.querySelectorAll('.skin-option').forEach(button => {
        button.addEventListener('click', function() {
            clearSkinPrompt();
            const skinId = this.dataset.skin;

            if (skinId === 'england-won' && !hasPassedEnglandQuiz()) {
                showEnglandQuiz(skinId);
            } else if (skinId === 'la-france-a-gagne' && !hasPassedFranceQuiz()) {
                showFranceQuiz(skinId);
            } else if (skinId === 'argentina-gano' && !hasPassedArgentinaQuiz()) {
                showArgentinaQuiz(skinId);
            } else {
                applySkin(skinId, true);
            }
        });
    });
});

let pendingEnglandSkin = null;
let englandQuizLocked = false;

function showEnglandQuiz(skinId) {
    const overlay = document.getElementById('england-quiz-overlay');
    if (!overlay || englandQuizLocked) return;

    pendingEnglandSkin = skinId;
    overlay.classList.add('show');
}

function hideEnglandQuiz() {
    const overlay = document.getElementById('england-quiz-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.classList.remove('is-wrong');
    pendingEnglandSkin = null;
}

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('england-quiz-overlay');
    if (!overlay) return;

    overlay.querySelectorAll('.england-quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            if (englandQuizLocked) return;

            if (this.dataset.answer === 'correct') {
                englandQuizLocked = true;
                overlay.classList.remove('is-wrong');
                var skinToApply = pendingEnglandSkin;
                pendingEnglandSkin = null;
                markEnglandQuizPassed();
                hideEnglandQuiz();
                if (skinToApply) {
                    applySkin(skinToApply, true);
                }
                setTimeout(function() { englandQuizLocked = false; }, 500);
            } else {
                overlay.classList.remove('is-wrong');
                void overlay.offsetWidth;
                overlay.classList.add('is-wrong');
                setTimeout(function() {
                    overlay.classList.remove('is-wrong');
                    overlay.classList.remove('show');
                    pendingEnglandSkin = null;
                }, 500);
            }
        });
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            hideEnglandQuiz();
        }
    });
});

// ---------- France quiz ----------

let francePendingSkin = null;
let franceQuizLocked = false;

function showFranceQuiz(skinId) {
    const overlay = document.getElementById('france-quiz-overlay');
    if (!overlay || franceQuizLocked) return;
    francePendingSkin = skinId;
    overlay.classList.add('show');
    const input = document.getElementById('france-quiz-input');
    if (input) {
        input.value = '';
        input.focus();
    }
}

function hideFranceQuiz() {
    const overlay = document.getElementById('france-quiz-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.classList.remove('is-wrong');
    francePendingSkin = null;
}

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('france-quiz-overlay');
    if (!overlay) return;

    function handleFranceSubmit() {
        if (franceQuizLocked) return;
        const input = document.getElementById('france-quiz-input');
        if (!input) return;

        const answer = input.value.trim();
        if (answer.toLowerCase() === 'mbappe') {
            franceQuizLocked = true;
            overlay.classList.remove('is-wrong');
            const skinToApply = francePendingSkin;
            francePendingSkin = null;
            markFranceQuizPassed();
            hideFranceQuiz();
            if (skinToApply) {
                applySkin(skinToApply, true);
            }
            setTimeout(function() { franceQuizLocked = false; }, 500);
        } else {
            overlay.classList.remove('is-wrong');
            void overlay.offsetWidth;
            overlay.classList.add('is-wrong');
            setTimeout(function() {
                overlay.classList.remove('is-wrong');
                overlay.classList.remove('show');
                francePendingSkin = null;
            }, 500);
        }
    }

    document.getElementById('france-quiz-submit').addEventListener('click', handleFranceSubmit);

    document.getElementById('france-quiz-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleFranceSubmit();
        }
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            hideFranceQuiz();
        }
    });
});

// ---------- Argentina quiz ----------

const ARGENTINA_ANSWER = ['M', 'E', 'S', 'S', 'I'];
let argentinaPendingSkin = null;
let argentinaQuizLocked = false;

function buildArgentinaGrid() {
    const grid = document.getElementById('argentina-quiz-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'argentina-quiz-letter';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        grid.appendChild(btn);
    }
}

function resetArgentinaQuiz() {
    document.querySelectorAll('.argentina-quiz-letter').forEach(function(btn) {
        btn.classList.remove('is-selected');
    });
    var status = document.getElementById('argentina-quiz-status');
    if (status) status.textContent = '';
}

function showArgentinaQuiz(skinId) {
    var overlay = document.getElementById('argentina-quiz-overlay');
    if (!overlay || argentinaQuizLocked) return;
    argentinaPendingSkin = skinId;
    resetArgentinaQuiz();
    overlay.classList.add('show');
}

function hideArgentinaQuiz() {
    var overlay = document.getElementById('argentina-quiz-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.classList.remove('is-wrong');
    argentinaPendingSkin = null;
}

document.addEventListener('DOMContentLoaded', function() {
    buildArgentinaGrid();

    var overlay = document.getElementById('argentina-quiz-overlay');
    if (!overlay) return;

    var selected = [];

    overlay.addEventListener('click', function(e) {
        var btn = e.target.closest('.argentina-quiz-letter');
        if (!btn) return;
        if (argentinaQuizLocked) return;

        var letter = btn.dataset.letter;
        var expectedIndex = selected.length;

        if (letter !== ARGENTINA_ANSWER[expectedIndex]) {
            argentinaQuizLocked = true;
            overlay.classList.remove('is-wrong');
            void overlay.offsetWidth;
            overlay.classList.add('is-wrong');
            selected = [];
            resetArgentinaQuiz();
            setTimeout(function() {
                overlay.classList.remove('is-wrong');
                overlay.classList.remove('show');
                argentinaPendingSkin = null;
                argentinaQuizLocked = false;
            }, 500);
            return;
        }

        btn.classList.add('is-selected');
        selected.push(letter);
        var status = document.getElementById('argentina-quiz-status');
        if (status) status.textContent = selected.join(' ');

        if (selected.length === ARGENTINA_ANSWER.length) {
            argentinaQuizLocked = true;
            var skinToApply = argentinaPendingSkin;
            argentinaPendingSkin = null;
            markArgentinaQuizPassed();
            hideArgentinaQuiz();
            if (skinToApply) {
                applySkin(skinToApply, true);
            }
            setTimeout(function() { argentinaQuizLocked = false; }, 500);
            selected = [];
        }
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            hideArgentinaQuiz();
            selected = [];
            resetArgentinaQuiz();
        }
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
