// ==UserScript==
// @name         Netflix Ad Skipper (Ad Markers)
// @namespace    https://github.com/TSMBolvo/netflix-ad-skipper
// @version      1.2
// @description  Automatically skip ads on Netflix (including ad markers in series)
// @author       TSMBolvo
// @match        *://*.netflix.com/*
// @grant        none
// @icon         https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico
// @updateURL    https://raw.githubusercontent.com/TSMBolvo/netflix-ad-skipper/main/netflix.user.js
// @downloadURL  https://raw.githubusercontent.com/TSMBolvo/netflix-ad-skipper/main/netflix.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Netflix Ad Skipper] Loaded");

    const skipIfAd = (video) => {
        if (!video) return;

        // Detect ads based on duration (15-60s typical range)
        if (video.duration >= 15 && video.duration <= 60) {
            console.log(`[Netflix Ad Skipper] Skipping short ad segment (${video.duration.toFixed(1)}s)`);
            video.currentTime = video.duration;
            return;
        }

        // Detect ad markers: Netflix sets 'adBreak' segments where controls are yellow
        if (document.querySelector('.ad-break-marker')) {
            const current = video.currentTime;
            const duration = video.duration;
            // If near an ad marker, skip forward a bit
            if (duration > 120 && (current / duration) < 0.95) {
                console.log(`[Netflix Ad Skipper] Ad marker detected at ${current.toFixed(1)}s — jumping forward`);
                video.currentTime = current + 90; // jump ~1.5 minutes past ad
            }
        }
    };

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('timeupdate', () => {
                skipIfAd(video);
            }, { once: false });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
