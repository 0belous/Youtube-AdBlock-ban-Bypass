// ==UserScript==
// @name Youtube AdBlock ban bypass
// @namespace http://tampermonkey.net/
// @version 1.2
// @description Fix the "Ad blockers violate YouTube's Terms of Service" Error
// @author Obelous
// @match https://www.youtube.com/*
// @match https://www.youtube-nocookie.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant none
// @license MIT
// ==/UserScript==
let currentPageUrl = window.location.href;
const delay = 200; // Milliseconds to wait after a failed attempt
const maxTries = 100; // Maximum number of retries in milliseconds
let tries = 0; // Current number of retries

window.addEventListener('beforeunload', function() {
    currentPageUrl = window.location.href;
});

document.addEventListener('yt-navigate-finish', function() {
    const newUrl = window.location.href;
    if (newUrl !== currentPageUrl) {
        const url = "https://www.youtube-nocookie.com/embed/" + splitUrl(newUrl) + "?autoplay=1";
        const player = document.getElementById("youtube-iframe");
        player.setAttribute('src', url);
    }
});

// returns the video ID
function splitUrl(str) {
    return str.split('=')[1].split('&')[0];
}

// main function
function run() {
    const block = document.querySelector('.yt-playability-error-supported-renderers');
    if (!block) {
        if (tries === maxTries) return;
        tries++;
        setTimeout(run, delay);
    } else {
        magic();
    }
}

function magic() {
    console.log("Loaded");
    // remove block screen
    const block = document.querySelector('.yt-playability-error-supported-renderers');
    if (!block) return;
    block.parentNode.removeChild(block);
    // get the url for the iframe
    const url = "https://www.youtube-nocookie.com/embed/" + splitUrl(window.location.href) + "?autoplay=1&modestbranding=1";
    // get the mount point for the iframe
    const oldplayer = document.getElementById("error-screen");
    // create the iframe
    const player = document.createElement('iframe');
    player.setAttribute('src', url);
    player.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    player.setAttribute('frameborder', '0');
    player.setAttribute('allowfullscreen', true);
    player.setAttribute('allowfullscreen', "allowfullscreen");
    player.setAttribute('mozallowfullscreen', "mozallowfullscreen");
    player.setAttribute('msallowfullscreen', "msallowfullscreen");
    player.setAttribute('oallowfullscreen', "oallowfullscreen");
    player.setAttribute('webkitallowfullscreen', "webkitallowfullscreen");
    player.setAttribute('webkitallowfullscreen', "webkitallowfullscreen");
    player.style = "height:100%;width:100%;border-radius:12px;";
    player.id = "youtube-iframe";
    // append the elements to the DOM
    oldplayer.appendChild(player);
    console.log('Finished');
}

// Execute the code
(function() {
    'use strict';
    run();
})();
