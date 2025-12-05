// ==UserScript==
// @name         rizu
// @namespace    https://kagane.org/
// @version      2025.1204
// @description  allows easy downloading
// @author       marin
// @match        https://kagane.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kagane.org
// @run-at       document-end
// @grant        none
// ==/UserScript==

console.info('start');

let reader_image;
let last_seen_alt;

let global_download;

window.addEventListener('keydown', (e) => {
    if (e.key == 'd') {
        global_download();
    }
});

const rizu = new MutationObserver(() => {
    console.info('mutation');
    link_image();

    process_image();
});

rizu.observe(document.documentElement, {
    childList: true,
    subtree: true
});

function link_image() {
    if (reader_image && reader_image.isConnected) return;

    reader_image = document.body.querySelector('.reader-pages-content img');
    console.info('linked image to', reader_image);
}

function process_image() {
    if (!reader_image) return;

    console.info('processing image');

    const alt = reader_image.alt;
    if (last_seen_alt == alt) return;

    const src = reader_image.src;

    const title = document.title;

    const manga_name_match = title.match(/^(.*?)\s*-\s*chapter/i);
    const manga_name = manga_name_match ? manga_name_match[1] : '';

    const manga_chapter_match = title.match(/chapter\s*(\d+)/i);
    const manga_chapter = manga_chapter_match ? manga_chapter_match[1] : '';

    const manga_page_match = alt.match(/page\s*(\d+)/i);
    const manga_page = manga_page_match ? manga_page_match[1] : '';

    const filename = `${manga_name.replaceAll(' ', '_')}_chapter_${manga_chapter}_page_${manga_page}`;

    reader_image.onclick = () => {
        download_image();
    };

    function download_image() {
        console.info('created click for', src, filename);

        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    global_download = download_image;
}
