'use strcit'

function onInit() {
    console.log('hi')
    
    // renderGallery()
    renderMeme()
}

function OnChangePage(btn) {

    var memePage = document.querySelector('.main-body-meme')
    var galaryPage = document.querySelector('.galary')

    if (btn.innerText === 'Galary') {
        memePage.classList.add('hidden')
        galaryPage.classList.remove('hidden')
        renderGallery()
    }

    else if (btn.innerText === 'Memes') {
        galaryPage.classList.add('hidden')
        memePage.classList.remove('hidden')
        renderMeme()
    }
}