// ==UserScript==
// @name Youtube AdBlock ban bypass
// @namespace http://tampermonkey.net/
// @version 1.3
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
    try{
    currentPageUrl = window.location.href;
    }catch(e){
        console.error('AdBlock Bypass: Failed to preserve URL    '+e);
    }
});

document.addEventListener('yt-navigate-finish', function() {
    try{
        const newUrl = window.location.href;
        if (newUrl !== currentPageUrl) {
            let url = "";
        if(window.location.href.includes('&list')){
            url = "https://www.youtube-nocookie.com/embed/" + extractParams(window.location.href).videoId + "?autoplay=1&list=" + extractParams(window.location.href).playlistId + "&index=" + extractParams(window.location.href).index;
        }else{
            url = "https://www.youtube-nocookie.com/embed/" + splitUrl(window.location.href) + "?autoplay=1";
        }
        console.log(url);
        const player = document.getElementById("youtube-iframe");
        player.setAttribute('src', url);
    }
    }catch(e){
        console.error('AdBlock Bypass: Failed to refresh player URL    '+e);
    }
});


// Get the video id from the url
function splitUrl(str) {
    try{
    return str.split('=')[1].split('&')[0];
    }catch(e){
    console.error('Failed to split url'+e);
    }
}


// main function

function run() {
    try{
    const block = document.querySelector('.yt-playability-error-supported-renderers');
    if (!block) {
        if (tries === maxTries) return;
        tries++;
        setTimeout(run, delay);
    } else {
        magic();
    }
    }catch(e){
        console.error('AdBlock Bypass: Failed to run    '+e);
    }
}


// URL parser
function extractParams(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const videoId = params.get('v');
    const playlistId = params.get('list');
    const index = params.get('index');
    return { videoId, playlistId, index };
}


function magic() {
    try{
    console.log("Loaded");
    // remove block screen
    const block = document.querySelector('.yt-playability-error-supported-renderers');
    if (!block) return;
    block.parentNode.removeChild(block);
    // get the url for the iframe
    let url = "";
    if(window.location.href.includes('&list')){
        url = "https://www.youtube-nocookie.com/embed/" + extractParams(window.location.href).videoId + "?autoplay=1&list=" + extractParams(window.location.href).playlistId + "&index=" + extractParams(window.location.href).index;
    }else{
        url = "https://www.youtube-nocookie.com/embed/" + splitUrl(window.location.href) + "?autoplay=1";
    }
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
    }catch(e){
        console.error('AdBlock Bypass: Failed to replace player    '+e);
    }
}

// Execute the code
(function() {
    'use strict';
    run();
})();