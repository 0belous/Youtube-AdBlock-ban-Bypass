    // ==UserScript==
    // @name         Youtube AdBlock ban bypass
    // @namespace    http://tampermonkey.net/
    // @version      1.1
    // @description  Fix the "Ad blockers violate YouTube's Terms of Service" Error
    // @author       Obelous
    // @match        https://www.youtube.com/*
    // @match        https://www.youtube-nocookie.com/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
    // @grant        none
    // @license      MIT
    // ==/UserScript==

    let currentPageUrl = window.location.href;

    window.addEventListener('beforeunload', function () {
        currentPageUrl = window.location.href;
    });

    document.addEventListener('yt-navigate-finish', function () {
        const newUrl = window.location.href;
        if (newUrl !== currentPageUrl) {
            const url = "https://www.youtube-nocookie.com/embed/" + splitUrl(newUrl) + "?autoplay=1";
            const player = document.getElementById("youtube-iframe");
            player.setAttribute('src', url);
        }
    });

    // returns the video ID
    function splitUrl(str) {
        return str.split('=')[1];
    }

    // main function
    function run() {
        console.log("Loaded");
        // remove block screen
        const block = document.querySelector('.yt-playability-error-supported-renderers');
        if(!block) return;
        block.parentNode.removeChild(block);
        // get the url for the iframe
        const url = "https://www.youtube-nocookie.com/embed/" + splitUrl(window.location.href) + "?autoplay=1";
        // get the mount point for the iframe
        const oldplayer = document.getElementById("error-screen");
        // create the iframe
        const player = document.createElement('iframe');
        player.setAttribute('src', url);
        player.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        player.setAttribute('frameborder', '0');
        player.setAttribute('allowfullscreen', true);
        player.style = "height:100%;width:100%;border-radius:12px;";
        player.id = "youtube-iframe";
        // append the elements to the DOM
        oldplayer.appendChild(player);
        console.log('Finished');
    }

    // Execute the code
    (function() {
        'use strict';
        //|             |||
        // RUN DELAY    VVV
        setTimeout(run, 1000);
    })();