/* =========================================================
   Crisis Page JavaScript
   Controls the global crisis popup.
========================================================= */


/* ---------- Create Crisis Popup ---------- */

function buildCrisisPopup() {

    if (document.getElementById("crisisPopup")) {
        return;
    }

    const popupMarkup = `
        <button class="crisis-floating-btn" type="button" data-crisis-open aria-label="Open crisis contacts">
            <i data-lucide="life-buoy" aria-hidden="true"></i>
            <span>Help</span>
        </button>

        <div class="crisis-popup-overlay" id="crisisPopup" aria-hidden="true">

            <section class="crisis-popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby="crisisPopupTitle">

                <button class="crisis-popup-close"
                    type="button"
                    data-crisis-close
                    aria-label="Close crisis contacts">

                    <i data-lucide="x"></i>

                </button>

                <div class="crisis-popup-header">

                    <span class="crisis-popup-icon">
                        <i data-lucide="shield-alert"></i>
                    </span>

                    <h2 id="crisisPopupTitle">
                        Need urgent support?
                    </h2>

                    <p>
                        If you or someone else is in danger,
                        reach out immediately.
                    </p>

                    <button class="crisis-popup-chat">

                        <i data-lucide="message-circle"></i>

                        <span>
                            Talk to someone now
                        </span>

                    </button>

                </div>

                <div class="crisis-popup-list">

                    <article class="crisis-popup-contact">

                        <div class="crisis-popup-contact-icon">
                            <i data-lucide="phone-call"></i>
                        </div>

                        <div>
                            <h3>Befrienders KL</h3>
                            <a href="tel:0379568145">
                                03-7956 8145
                            </a>

                            <p>
                                Free confidential emotional support.
                            </p>
                        </div>

                    </article>

                    <article class="crisis-popup-contact">

                        <div class="crisis-popup-contact-icon">
                            <i data-lucide="heart-pulse"></i>
                        </div>

                        <div>

                            <h3>MIASA</h3>

                            <a href="tel:0327806803">
                                03-2780 6803
                            </a>

                            <p>
                                Mental health counselling support.
                            </p>

                        </div>

                    </article>

                    <article class="crisis-popup-contact">

                        <div class="crisis-popup-contact-icon">
                            <i data-lucide="siren"></i>
                        </div>

                        <div>

                            <h3>Emergency</h3>

                            <a href="tel:999">
                                999
                            </a>

                            <p>
                                Immediate emergency assistance.
                            </p>

                        </div>

                    </article>

                </div>

            </section>

        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", popupMarkup);

    if (window.lucide) {
        lucide.createIcons();
    }

}


/* ---------- Open Popup ---------- */

function openCrisisPopup() {

    const popup = document.getElementById("crisisPopup");

    if (!popup) return;

    if (typeof closeMobileMenu === "function") {
        closeMobileMenu();
    }

    popup.classList.add("open");
    popup.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


/* ---------- Close Popup ---------- */

function closeCrisisPopup() {

    const popup = document.getElementById("crisisPopup");

    if (!popup) return;

    popup.classList.remove("open");
    popup.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


/* ---------- Initialize ---------- */

document.addEventListener("DOMContentLoaded", function () {

    buildCrisisPopup();

});


/* ---------- Click Events ---------- */

document.addEventListener("click", function (event) {

    const openButton = event.target.closest("[data-crisis-open]");
    const closeButton = event.target.closest("[data-crisis-close]");

    const overlay =
        event.target.classList.contains("crisis-popup-overlay");

    if (openButton) {

        event.preventDefault();
        openCrisisPopup();

    }

    if (closeButton || overlay) {

        closeCrisisPopup();

    }

});


/* ---------- ESC Key ---------- */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeCrisisPopup();

    }

});