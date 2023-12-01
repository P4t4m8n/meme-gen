'use strcit'

// rendering func
function renderGallery() {
    var strHtml
    var imgs = getImgs()

    var upLoadHtml = `  <label for="file-input">
    <img class="upload-img" src="img/upload.png">
    </label>
    <img class="random-img" onclick="onRndImgPick()" src="img/random.png">`

    strHtml = imgs.map(img => `<img src="${img.url}" onclick="onImgClick(${img.id})"
     data-keywords=${img.keywords}>`).join('')

    document.querySelector('.container').innerHTML = upLoadHtml + strHtml
    console.log(imgs)
    renderSortByKeywords()
}

function renderSortByKeywords() {

    var keywords = getKeywords()

    var strHtml = `<ul class="key-words">`
    strHtml += keywords.map(keyword => `<li style="font-size:${keyword.size}px" onclick="onKeyword(this)">${keyword.key}</li>`).join('')
    strHtml += `</ul>`

    document.querySelector('.keyword-con').innerHTML = strHtml
    console.log(keywords)

}



//img picker

function onImgClick(imgId) {
    setImg(imgId)
    changePage('Memes')
}

function onRndImgPick() {
    //pick a rnd img and change to meme page
}

//sorts

function onKeyword(el) {
    const key = el.innerText
    filterBy(key)
    renderGallery()

}