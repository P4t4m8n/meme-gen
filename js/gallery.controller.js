'use strcit'

// rendering func
function renderGallery() {
    var strHtml
    var imgs = getImgs()

    var upLoadHtml = `  <label for="file-input">
    <img class="upload-img" src="img/upload.png"">
</label>`

    strHtml = imgs.map(img => `<img src="${img.url}" onclick="onImgClick(${img.id})"
     data-keywords=${img.keywords}>`).join('')

    document.querySelector('.container').innerHTML = upLoadHtml + strHtml
}

//img picker

function onImgClick(imgId) {
    console.log('hi')
    setImg(imgId)
    changePage('Memes')
}