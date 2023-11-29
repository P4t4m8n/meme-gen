'use strcit'

// rendering func
function renderGallery() {
    var strHtml
    var imgs = getImgs()

    strHtml = imgs.map(img => `<img src="${img.url}" onclick="onImgClick(${img.id})"
     data-keywords=${img.keywords}>`).join('')
    document.querySelector('.container').innerHTML = strHtml
}

//img picker

function onImgClick(imgId) {
    console.log('hi')
    setImg(imgId)
    changePage('Memes')
}