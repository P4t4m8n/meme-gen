'use strcit'

// rendering func
function renderGallery() {

    var strHtml
    var imgs = getImgs()

    var upLoadHtml = `<label for="file-input">
                      <img class="upload-img" src="img/upload.png"></label>
                      <img src="img/random.png" class="random-img" onclick="onImgClick(-1)">`

    strHtml = imgs.map(img => `<img src="${img.url}" onclick="onImgClick(${img.id})"
                                data-keywords=${img.keywords}>`).join('')

    document.querySelector('.container').innerHTML = upLoadHtml + strHtml
    renderSortByKeywords()
}

function renderSortByKeywords() {

    var keywords = getKeywords()

    var strHtml = `<ul class="key-words"> `

    strHtml += keywords.map(keyword => `<li style="font-size:${keyword.size}px" 
                                        onclick="onKeyword(this,false)">${keyword.key}</li>`).join('')

    strHtml += `</ul>`

    var strHtmlList = `<option value="All"></option>`
    strHtmlList += keywords.map(keywords => `<option value="${keywords.key}">`).join('')

    document.querySelector('.keyword-con').innerHTML = strHtml
    document.querySelector('.keywords-list').innerHTML = strHtmlList
}



//img picker

function onImgClick(imgId) {
    console.log(imgId)
    if (imgId < 0) imgId = getRandomInt(0, 17)

    addNewMeme(imgId)
    changePage('Memes')
}

//filter

function onKeyword(el, isList) {
    console.log(el.value)
    const key = (isList) ? el.value : el.innerText

    if (!isList) document.querySelector('.keyword-choice').value = key
    setFilterBy(key)
    renderGallery()
}
