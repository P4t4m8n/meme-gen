'use strcit'

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderMeme()
}

function renderMeme() {
    // debugger
    const imgUrl = getMemeImg(1)
    const imgContent = getMeme().lines
    var imgObj = new Image()

    imgObj.onload = function () {
        gCtx.drawImage(imgObj, 0, 0, gElCanvas.width, gElCanvas.height)
        imgContent.forEach(line => drawText(line, 50, 50))

    }
    imgObj.src = imgUrl
    renderLines()
}

function drawText(txtInfo, x, y) {

    var memeTxt = txtInfo.txt

    gCtx.fillStyle = txtInfo.color
    gCtx.font = txtInfo.size.toString() + 'px Arial'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(memeTxt, x, y)
}

function renderLines() {
    const lines = document.querySelectorAll('.meme-txt')
    const memeLines = getMeme().lines

    for (var i = 0; i < memeLines.length; i++) {
        lines[i].value = memeLines[i].txt
    }
}

function onSetLineTxt(el) {
    const txt = el.value
    setLineTxt(txt)
    renderMeme()
}



//img upload

function onImgInput(ev) {
    loadImageFromInput(ev, renderMeme)
}

function loadImageFromInput(ev, onImageReady) {

    const reader = new FileReader()
    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}
