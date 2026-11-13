
/* ==========================================================
   ISTITUTO FSMI PRAYER APP
   NAVIGATION.JS

   Native URL Navigation & Android Back Handler

   - Normal HTML page navigation
   - Browser history navigation
   - Android Back button support
   - Home links return directly to index.html
   - Exit application when already on the homepage
========================================================== */


/* ==========================================================
   HOME LINK HANDLER

   Prevent duplicate homepage history entries.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(
        "a.home-link, a[href='index.html'], a[href='./index.html']"
    ).forEach(link => {

        link.addEventListener("click", function (e) {

            // Allow opening in a new tab or window
            if (
                e.ctrlKey ||
                e.metaKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0 ||
                this.target === "_blank"
            ) {
                return;
            }

            e.preventDefault();

            window.location.replace("index.html");

        });

    });

});


/* ==========================================================
   ANDROID BACK BUTTON

   Cordova Native WebView

   - Previous page: return using browser history
   - Homepage: exit application
========================================================== */

document.addEventListener("deviceready", () => {

    document.addEventListener("backbutton", function (e) {

        e.preventDefault();

        const pathname = window.location.pathname;

        const isIndex =
            pathname.endsWith("/") ||
            pathname.endsWith("/index.html") ||
            pathname === "";

        if (isIndex || window.history.length <= 1) {

            // Exit application from homepage
            if (
                navigator.app &&
                typeof navigator.app.exitApp === "function"
            ) {

                navigator.app.exitApp();

            } else if (
                typeof navigator.exitApp === "function"
            ) {

                navigator.exitApp();

            }

        } else {

            // Return to previous HTML page
            window.history.back();

        }

    }, false);

}, false);
