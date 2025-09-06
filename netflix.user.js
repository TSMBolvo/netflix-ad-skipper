// ==UserScript==
// @name         Netflix Ad Skipper (Site-Specific)
// @namespace    https://github.com/TSMBolvo/netflix-ad-skipper
// @version      1.0
// @description  Automatically skip or mute ads on Netflix (only runs on Netflix)
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

    const skipAd = (video) => {
        // Example detection logic: ads usually < 90 seconds
        if (video && video.duration > 0 && video.duration < 90) {
            console.log("[Netflix Ad Skipper] Ad detected — skipping");
            video.currentTime = video.duration; // jump to end
        }
    };

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            skipAd(video);

            // Watch video progress continuously
            video.addEventListener('timeupdate', () => {
                skipAd(video);
            }, { once: false });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
