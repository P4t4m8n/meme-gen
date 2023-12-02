'use strcit'

// rendering func
function renderGallery() {
    var strHtml
    var imgs = getImgs()

    var upLoadHtml = `  <label for="file-input">
    <img class="upload-img" src="img/upload.png">
    </label>
    <img src="img/random.png" class="random-img" onclick="onRndPick(this)">`

    strHtml = imgs.map(img => `<img src="${img.url}" onclick="onImgClick(${img.id})"
     data-keywords=${img.keywords}>`).join('')

    document.querySelector('.container').innerHTML = upLoadHtml + strHtml
    console.log(imgs)
    renderSortByKeywords()
}

function renderSortByKeywords() {

    var keywords = getKeywords()

    var strHtml = `<ul class="key-words">
    `
    strHtml += keywords.map(keyword => `<li style="font-size:${keyword.size}px" onclick="onKeyword(this,false)">${keyword.key}</li>`).join('')
    strHtml += `</ul>`

    var strHtmlList = `<option value="All"></option>`
    strHtmlList += keywords.map(keywords => `<option value="${keywords.key}">`).join('')
    console.log(strHtmlList)
    console.log(keywords)


    document.querySelector('.keyword-con').innerHTML = strHtml
    document.querySelector('.keywords-list').innerHTML = strHtmlList


}



//img picker

function onImgClick(imgId) {
    setImg(imgId)
    changePage('Memes')
}

function onRndPick() {
    const rndId = getRandomInt(0, 17)
    setImg(rndId)
    changePage('Memes')
}


//sorts

function onKeyword(el, isList) {
    console.log(el.value)
    const key = (isList) ? el.value : el.innerText

    if (!isList) document.querySelector('.keyword-choice').value = key
    setFilterBy(key)
    renderGallery()

}