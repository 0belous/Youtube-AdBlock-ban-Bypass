// ==UserScript==
// @name          Youtube AdBlock ban bypass
// @namespace     http://tampermonkey.net/
// @version       1.4
// @description   Fix the "Ad blockers violate YouTube's Terms of Service" Error
// @author        Obelous
// @contributors  Master Racer, Insignia Malignia, 20excal07
// @match         https://www.youtube.com/*
// @match         https://www.youtube-nocookie.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant         none
// @license       MIT
// ==/UserScript==

let currentPageUrl = window.location.href;
const delay = 200; // Milliseconds to wait after a failed attempt
const maxTries = 100; // Maximum number of retries in milliseconds
let tries = 0; // Current number of retries

window.addEventListener('beforeunload', function() {
    try {
        currentPageUrl = window.location.href;
    } catch(e) {
        console.error('AdBlock Bypass: Failed to preserve URL    '+e);
    }
});

document.addEventListener('yt-page-type-changed', function() {
    const newUrl = window.location.href;
    // remove the player iframe when the user navigates away from a "watch" page
    if (!newUrl.includes("watch")) {
        removeIframe();
    }
});

document.addEventListener('yt-navigate-finish', function() {
    try {
        const newUrl = window.location.href;
        // If not on video page remove player
        const player = document.getElementById("youtube-iframe");w
        // Remove player if not on video
        if(newUrl.endsWith('.com/')){
            player.remove();
        }
        if (newUrl !== currentPageUrl) {
            createIframe(newUrl);
        }
    } catch(e) {
        console.error('AdBlock Bypass: Failed to refresh player URL    '+e);
    }
});

// Get the video id from the url
function splitUrl(str) {
    try{
        return str.split('=')[1].split('&')[0];
    } catch(e) {
        console.error('Failed to split url'+e);
    }
}

// main function
function run() {
    try {
        const block = document.querySelector('.yt-playability-error-supported-renderers');
        if (!block) {
            if (tries === maxTries) return;
            tries++;
            setTimeout(run, delay);
        } else {
            magic();
        }
    } catch(e) {
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
        const url = window.location.href;
        createIframe(url);
        console.log('Finished');
    } catch(e) {
        console.error('AdBlock Bypass: Failed to replace player    '+e);
    }
}

// get the timestamp tag from the video URL, if any
function getTimestampFromUrl(str) {
    const timestamp = str.split("t=")[1];
    if (timestamp) {
        const timeArray = timestamp.split('&')[0].split(/h|m|s/);
        // we need to convert into seconds first, since "start=" only supports that unit
        if (timeArray.length < 3) {
            //seconds only, e.g. "t=30s" or "t=300"
            return "&start=" + timeArray[0];
        } else if (timeArray.length == 3) {
            // minutes & seconds, e.g. "t=1m30s"
            const timeInSeconds = (parseInt(timeArray[0]) * 60) + parseInt(timeArray[1]);
            return "&start=" + timeInSeconds;
        } else {
            // hours, minutes & seconds, e.g. "t=1h30m15s"
            const timeInSeconds = (parseInt(timeArray[0]) * 3600) + (parseInt(timeArray[1]) * 60) + parseInt(timeArray[2]);
            return "&start=" + timeInSeconds;
        }
    }
    return "";
}

// bring the iframe to the front - this helps with switching between theater & default mode
function bringToFront(target_id) {
    const all_z = [];
    document.querySelectorAll("*").forEach(function(elem) {
        all_z.push(elem.style.zIndex)
    })
    const max_index = Math.max.apply(null, all_z.map((x) => Number(x)));
    const new_max_index = max_index + 1;
    document.getElementById(target_id).style.zIndex = new_max_index;
}

function createIframe(newUrl) {
    let url = "";
    const commonArgs = "autoplay=1&modestbranding=1";
    const params = extractParams(newUrl);
    if(newUrl.includes('&list')){
        url = "https://www.youtube-nocookie.com/embed/" + params.videoId + "?" + commonArgs + "&list=" + params.playlistId + "&index=" + params.index;
    } else {
        url = "https://www.youtube-nocookie.com/embed/" + params.videoId + "?" + commonArgs + getTimestampFromUrl(newUrl);
    }
    console.log(url);

    // recreate the player iframe if it was removed
    let player = document.getElementById("youtube-iframe");
    if(!player) {
        // get the mount point for the iframe
        const oldplayer = document.getElementById("error-screen");
        // create the iframe
        player = document.createElement('iframe');
        setYtPlayerAttributes(player, url);
        player.style = "height:100%;width:100%;border-radius:12px;";
        player.id = "youtube-iframe";
        // append the elements to the DOM
        oldplayer.appendChild(player);
    } else {
        setYtPlayerAttributes(player, url);
    }
    bringToFront("youtube-iframe");
}

function removeIframe() {
    const player = document.getElementById("youtube-iframe");
    player.parentNode.removeChild(player);
}

function setYtPlayerAttributes(player, url){
    // set all the necessary player attributes here
    player.setAttribute('src', url);
    player.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    player.setAttribute('frameborder', '0');
    player.setAttribute('allowfullscreen', "allowfullscreen");
    player.setAttribute('mozallowfullscreen', "mozallowfullscreen");
    player.setAttribute('msallowfullscreen', "msallowfullscreen");
    player.setAttribute('oallowfullscreen', "oallowfullscreen");
    player.setAttribute('webkitallowfullscreen', "webkitallowfullscreen");
}

// Todo: get rid of this janky solution for double audio
function removeDuplicate() {
  var iframes = document.querySelectorAll('#youtube-iframe');
  var uniqueIds = {};
  console.log(uniqueIds);

  iframes.forEach(function (iframe) {
    var iframeId = iframe.id;

    if (uniqueIds[iframeId]) {
      iframe.remove();
    } else {
      uniqueIds[iframeId] = true;
    }
  });
  }
setInterval(removeDuplicate, 5000);
// Execute the code
(function() {
    'use strict';
    run();
})();
