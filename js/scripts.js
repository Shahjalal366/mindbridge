/* ── Mobile menu ── */

const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const hamburgerButton = document.getElementById('hamburgerBtn');

function openMobileMenu() {
    if (!mobileMenu || !mobileOverlay || !hamburgerButton) {
        return;
    }

    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');

    hamburgerButton.setAttribute('aria-expanded', 'true');
    hamburgerButton.setAttribute('aria-label', 'Close menu');

    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (!mobileMenu || !mobileOverlay || !hamburgerButton) {
        return;
    }

    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');

    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.setAttribute('aria-label', 'Open menu');

    document.body.style.overflow = '';
}

function toggleMobileMenu() {
    if (!mobileMenu) {
        return;
    }

    const isOpen = mobileMenu.classList.contains('open');

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


/* ── Highlight active nav link ── */

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

const navLinks = document.querySelectorAll('.nav-left a, .nav-right a, .mobile-menu a');

navLinks.forEach(function (link) {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});


/* ── Login / Logout nav display ── */

document.addEventListener('DOMContentLoaded', function () {
    const session = JSON.parse(localStorage.getItem('mb_session') || 'null');

    const register = document.getElementById('navRegister');
    const login = document.getElementById('navLogin');

    if (session) {
        if (register) {
            register.style.display = 'none';
        }

        if (login) {
            login.textContent = 'Log Out';
            login.href = '#';

            login.classList.remove('login-btn');
            login.classList.add('logout-btn');

            login.onclick = function (event) {
                event.preventDefault();

                localStorage.removeItem('mb_session');

                location.href = 'index.html';
            };

            const userName = document.createElement('span');

            userName.className = 'nav-user';
            userName.textContent = '👤 ' + session.firstName;

            login.parentNode.insertBefore(userName, login);
        }
    }
});


/* ── Global crisis popup ── */

function buildCrisisPopup() {
    if (document.getElementById('crisisPopup')) {
        return;
    }

    const popupMarkup = `
        <button class="crisis-floating-btn" type="button" data-crisis-open aria-label="Open crisis contacts">
            <i data-lucide="life-buoy" aria-hidden="true"></i>
            <span>Help</span>
        </button>

        <div class="crisis-popup-overlay" id="crisisPopup" aria-hidden="true">
            <section class="crisis-popup" role="dialog" aria-modal="true" aria-labelledby="crisisPopupTitle">
                <button class="crisis-popup-close" type="button" data-crisis-close aria-label="Close crisis contacts">
                    <i data-lucide="x" aria-hidden="true"></i>
                </button>

                <div class="crisis-popup-header">
                    <span class="crisis-popup-icon" aria-hidden="true">
                        <i data-lucide="shield-alert"></i>
                    </span>

                    <h2 id="crisisPopupTitle">Need urgent support?</h2>

                    <p>If you or someone else is in danger, reach out immediately. These contacts are available now.</p>

                    <button class="crisis-popup-chat" type="button">
                        <i data-lucide="message-circle" aria-hidden="true"></i>
                        <span>Talk to someone now - Live Chat</span>
                    </button>
                </div>

                <div class="crisis-popup-list" aria-label="Crisis contacts">
                    <article class="crisis-popup-contact">
                        <div class="crisis-popup-contact-icon" aria-hidden="true">
                            <i data-lucide="phone-call"></i>
                        </div>

                        <div>
                            <h3>Befrienders KI - 24/7 Crisis Line</h3>
                            <a href="tel:0379568145">03-7956 8145</a>
                            <p>Free, confidential support in English and Bahasa Malaysia.</p>
                        </div>
                    </article>

                    <article class="crisis-popup-contact">
                        <div class="crisis-popup-contact-icon" aria-hidden="true">
                            <i data-lucide="heart-pulse"></i>
                        </div>

                        <div>
                            <h3>MIASA - Mental Illness Awareness &amp; Support</h3>
                            <a href="tel:0327806803">03-2780 6803</a>
                            <p>Mental health crisis support and counselling.</p>
                        </div>
                    </article>

                    <article class="crisis-popup-contact">
                        <div class="crisis-popup-contact-icon" aria-hidden="true">
                            <i data-lucide="siren"></i>
                        </div>

                        <div>
                            <h3>Emergency Services</h3>
                            <a href="tel:999">999</a>
                            <p>If you or someone else is in immediate danger.</p>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupMarkup);

    if (window.lucide) {
        lucide.createIcons();
    }
}

function openCrisisPopup() {
    const popup = document.getElementById('crisisPopup');

    if (!popup) {
        return;
    }

    closeMobileMenu();

    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';
}

function closeCrisisPopup() {
    const popup = document.getElementById('crisisPopup');

    if (!popup) {
        return;
    }

    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
}

buildCrisisPopup();

document.addEventListener('click', function (event) {
    const openButton = event.target.closest('[data-crisis-open]');
    const closeButton = event.target.closest('[data-crisis-close]');
    const popupOverlay = event.target.classList.contains('crisis-popup-overlay');

    if (openButton) {
        event.preventDefault();
        openCrisisPopup();
    }

    if (closeButton || popupOverlay) {
        closeCrisisPopup();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeCrisisPopup();
    }
});


/* ── Heart toggle on help cards ── */

function toggleHeart(button) {
    const heartPath = button.querySelector('svg path');
    const isLiked = button.classList.toggle('liked');

    button.setAttribute('aria-pressed', isLiked);

    if (heartPath) {
        if (isLiked) {
            heartPath.setAttribute('fill', 'currentColor');
        } else {
            heartPath.setAttribute('fill', 'none');
        }
    }
}


/* ── Forum category selection ── */

const forumCategoryButtons = document.querySelectorAll('.forum-category-btn');

forumCategoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        forumCategoryButtons.forEach(function (categoryButton) {
            categoryButton.classList.remove('is-active');
        });

        button.classList.add('is-active');
    });
});

/* ── Login form ── */
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('mb_users') || '[]');

        const matchedUser = users.find(function (user) {
            return user.email === email && user.password === password;
        });

        if (!matchedUser) {
            alert('Invalid email or password.');
            return;
        }

        localStorage.setItem('mb_session', JSON.stringify(matchedUser));

        alert('Login successful!');
        window.location.href = 'index.html';
    });
}

/* ── Lucide icons ── */

if (window.lucide) {
    lucide.createIcons();
}