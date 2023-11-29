'use strcit'

function onInit() {
    renderGallery()
}

//page management

function OnChangePage(btn) {

    changePage(btn.innerText)
}

function changePage(page) {

    var memePage = document.querySelector('.main-body-meme')
    var galaryPage = document.querySelector('.galary')

    if (page === 'Galary') {
        memePage.classList.add('hidden')
        galaryPage.classList.remove('hidden')
        renderGallery()
    }

    else if (page === 'Memes') {
        galaryPage.classList.add('hidden')
        memePage.classList.remove('hidden')
        renderMeme()
        window.addEventListener("keyup", keyUpHandler, true)
    }
}