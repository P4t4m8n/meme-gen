'use strcit'

function onInit() {
    renderGallery()
}


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

        // var verification = getMemes()
        // console.log(verification)
        // if (!verification) {
        //     alert('No saved memes, pick one')
        //     return
        // }
        galaryPage.classList.add('hidden')
        memePage.classList.remove('hidden')
        renderMeme()
        addListeners()
        renderEmojis()
    }
}