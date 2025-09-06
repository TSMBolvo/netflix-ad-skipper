// ==UserScript==
// @name         Netflix Ad Skipper (Manifest-Based)
// @namespace    https://github.com/TSMBolvo/netflix-ad-skipper
// @version      1.3
// @description  Skip Netflix ads precisely using the manifest JSON timeline
// @author       TSMBolvo
// @match        *://*.netflix.com/*
// @grant        none
// @icon         https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico
// @updateURL    https://raw.githubusercontent.com/TSMBolvo/netflix-ad-skipper/main/netflix.user.js
// @downloadURL  https://raw.githubusercontent.com/TSMBolvo/netflix-ad-skipper/main/netflix.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Netflix Ad Skipper v1.3] Loaded");

    let adBreaks = [];

    const getPlayerManifest = () => {
        try {
            const player = document.querySelector('video');
            if (!player) return;

            const state = window.netflix && window.netflix.react && window.netflix.react.store;
            if (!state) return;

            const playbackState = state.getState && state.getState().playback;
            if (playbackState && playbackState.playbackManifest && playbackState.playbackManifest.adBreaks) {
                adBreaks = playbackState.playbackManifest.adBreaks.map(ad => ({
                    start: ad.startTime,
                    end: ad.endTime
                }));
            }
        } catch (e) {
            console.warn("[Netflix Ad Skipper] Failed to read manifest:", e);
        }
    };

    const skipAds = (video) => {
        if (!video || adBreaks.length === 0) return;

        const currentTime = video.currentTime;

        for (const ad of adBreaks) {
            if (currentTime >= ad.start && currentTime < ad.end) {
                console.log(`[Netflix Ad Skipper] Skipping ad from ${ad.start}s → ${ad.end}s`);
                video.currentTime = ad.end + 0.1; // jump just past the ad
                break;
            }
        }
    };

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            getPlayerManifest();

            video.addEventListener('timeupdate', () => skipAds(video), { once: false });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
