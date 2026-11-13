
document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       1. GENERIC SLIDER SYSTEM
       Supports unlimited independent sliders
    ========================================= */

    document.querySelectorAll(".content-slider").forEach(slider => {

        const pages = Array.from(
            slider.querySelectorAll(".slider-page")
        );

        const prevButton = slider.querySelector(".slider-prev");
        const nextButton = slider.querySelector(".slider-next");
        const dotsContainer = slider.querySelector(".slider-dots");

        if (pages.length === 0) return;

        let currentIndex = 0;

        // Create dots automatically
        if (dotsContainer) {

            dotsContainer.replaceChildren();

            pages.forEach((page, index) => {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "slider-dot";
                dot.setAttribute(
                    "aria-label",
                    `Vai alla pagina ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    showPage(index);
                });

                dotsContainer.appendChild(dot);

            });

        }

        const dots = dotsContainer
            ? Array.from(dotsContainer.querySelectorAll(".slider-dot"))
            : [];

        function showPage(index) {

            currentIndex = (index + pages.length) % pages.length;

            pages.forEach((page, i) => {

                const isActive = i === currentIndex;

                page.classList.toggle("active", isActive);
                page.setAttribute("aria-hidden", String(!isActive));

            });

            dots.forEach((dot, i) => {

                const isActive = i === currentIndex;

                dot.classList.toggle("active", isActive);

                if (isActive) {
                    dot.setAttribute("aria-current", "page");
                } else {
                    dot.removeAttribute("aria-current");
                }

            });

            if (prevButton) {
                prevButton.disabled = pages.length <= 1;
            }

            if (nextButton) {
                nextButton.disabled = pages.length <= 1;
            }

        }

        if (prevButton) {
            prevButton.addEventListener("click", () => {
                showPage(currentIndex - 1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                showPage(currentIndex + 1);
            });
        }

        // Initialize this slider
        showPage(0);

    });



    /* =========================================
       2. GENERIC LANGUAGE SELECTOR
    ========================================= */

    document.querySelectorAll(".language-container").forEach(container => {

        const buttons = container.querySelectorAll(
            "[data-language-target]"
        );

        const languages = container.querySelectorAll(
            ".prayer-language"
        );

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                const targetId = button.dataset.languageTarget;

                const target = container.querySelector(
                    "#" + CSS.escape(targetId)
                );

                if (!target) return;

                buttons.forEach(item => {
                    item.classList.remove("active");
                });

                languages.forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");
                target.classList.add("active");

            });

        });

    });



    /* =========================================
       3. FONT SIZE CONTROLS
       Only active on data-zoom="true"
    ========================================= */

    if (document.body.dataset.zoom === "true") {

        const MIN_ZOOM = -5;
        const MAX_ZOOM = 5;
        const DEFAULT_ZOOM = 0;

        let savedZoom = parseInt(
            localStorage.getItem("zoomLevel"),
            10
        );

        if (!Number.isFinite(savedZoom)) {
            savedZoom = DEFAULT_ZOOM;
        }

        let zoomLevel = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, savedZoom)
        );

        // Create zoom controls
        const zoomContainer = document.createElement("div");

        zoomContainer.className = "zoom-container";

        zoomContainer.innerHTML = `
            <button
                type="button"
                id="zoomToggle"
                class="zoom-btn"
                aria-label="Regola dimensione del testo">
                🔍
            </button>

            <div id="zoomControls" class="zoom-controls">

                <button
                    type="button"
                    id="zoomIn"
                    class="zoom-btn"
                    aria-label="Ingrandisci testo">
                    +
                </button>

                <button
                    type="button"
                    id="zoomOut"
                    class="zoom-btn"
                    aria-label="Riduci testo">
                    −
                </button>

            </div>
        `;

        document.body.appendChild(zoomContainer);

        const zoomToggle = zoomContainer.querySelector("#zoomToggle");
        const zoomControls = zoomContainer.querySelector("#zoomControls");
        const zoomIn = zoomContainer.querySelector("#zoomIn");
        const zoomOut = zoomContainer.querySelector("#zoomOut");

        let hideTimeout = null;

        function updateZoom() {

            const fontSize = 17 + (zoomLevel * 2);

            document.documentElement.style.setProperty(
                "--prayer-font-size",
                fontSize + "px"
            );

            zoomIn.disabled = zoomLevel >= MAX_ZOOM;
            zoomOut.disabled = zoomLevel <= MIN_ZOOM;

            localStorage.setItem("zoomLevel", zoomLevel);

        }

        function showZoomControls() {

            zoomControls.classList.add("show");

            clearTimeout(hideTimeout);

            hideTimeout = setTimeout(() => {
                zoomControls.classList.remove("show");
            }, 5000);

        }

        zoomToggle.addEventListener("click", showZoomControls);

        zoomIn.addEventListener("click", () => {

            if (zoomLevel < MAX_ZOOM) {
                zoomLevel++;
                updateZoom();
            }

            showZoomControls();

        });

        zoomOut.addEventListener("click", () => {

            if (zoomLevel > MIN_ZOOM) {
                zoomLevel--;
                updateZoom();
            }

            showZoomControls();

        });

        updateZoom();

    }

});
