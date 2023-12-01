'use strcit'

var gElCanvas = document.querySelector('canvas')
var gCtx = gElCanvas.getContext('2d')
var gLineIdx = 1
var gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
var gMousePos
var gTxtBoxFoucs = false
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']



//render func

function renderMeme() {
    const imgUrl = getCurrImg().url
    var imgContent = getMeme().lines

    var imgObj = new Image()
    imgObj.onload = function () {
        function animate() {
            gCtx.drawImage(imgObj, 0, 0, gElCanvas.width, gElCanvas.height)
            if (imgContent) {
                imgContent.forEach(line => {
                    var { pos } = line
                    drawText(line, pos.x, pos.y)
                })
            }
            requestAnimationFrame(animate)
        }
        animate()

    }
    imgObj.src = imgUrl
    resizeCanvas()
    renderTxtBox()
    renderEmojis()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function renderEmojis() {

    const emojis = getEmojis()

    var strHtml = `<ul class="emoji-list">`

    strHtml += emojis.map(emoji =>
        `<li onclick="onEmojiClick(this)">${emoji}</li>`
    ).join('')

    strHtml += `</ul>`
    document.querySelector('.emoji-box').innerHTML = strHtml
}


function renderTxtBox() {
    const memeLines = getCurrLine().txt
    document.querySelector('.meme-txt').value = memeLines
}

//txt manger

function drawText(txtInfo, x, y) {
    var memeTxt = txtInfo.txt

    gCtx.fillStyle = txtInfo.color
    gCtx.font = txtInfo.size.toString() + 'px Arial'

    gCtx.textAlign = txtInfo.align

    let measures = gCtx.measureText(memeTxt);
    let height = measures.actualBoundingBoxAscent + measures.actualBoundingBoxDescent;


    setLineWidth(measures.width)
    setLineHeight(height)

    gCtx.fillText(memeTxt, x, y)

    // gCtx.strokeRect(x, y, measures.width, height + 8)
    // if (txtInfo.isMarked) {
    // gCtx.fillStyle = '#ff0'
    // gCtx.fillRect(x, y, measures.width, height)
    //     if (txtInfo.align === 'left') gCtx.strokeRect(x, y, measures.width, height + 8)
    //     else if (txtInfo.align === 'center') gCtx.strokeRect(x - (measures.width / 2), y - measures.width, measures.width, height + 8)
    // }
}

function onLineMove(isUp) {
    // (isUp)
}

function OnAddKeyword() {

    addKeyword(prompt('enter'))
    
   
}

function onFontChange() {
    //open model change font
}

function onRndImgPick() {
    //pick a rnd img and change to meme page
}

function onSetLineTxt(el) {
    const txt = el.value
    setLineTxt(txt, true)
    renderMeme()
}

function onSetAlign(btn) {
    const align = btn.innerText
    setTxtAlign(align)
    renderMeme()
}

function onSetColor(el) {
    setColor(el.value)
    renderMeme()
}

function onSetFontSize(size) {
    setFontSize(size)
    renderMeme()
}

function onBoxFoucs() {
    gTxtBoxFoucs = !gTxtBoxFoucs
}


//Listeners

function addListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener("keyup", keyUpHandler, true)
    window.addEventListener('resize', () => {
        resizeCanvas()
        const gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
        renderMeme()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

//mouse and touch events

function onDown(ev) {
    const pos = getEvPos(ev)
    // console.log(pos)
    if (!isInTxtArea(pos)) return
    gMousePos = pos
    renderMeme()
}

function onMove(ev) {
    if (!isLineClicked()) return
    const pos = getEvPos(ev)
    const dx = pos.x - gMousePos.x
    const dy = pos.y - gMousePos.y
    setPos({ x: dx, y: dy })
    gMousePos = pos
    renderMeme()
}

function onUp() {
    setIsClicked(false)
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}



//txt test

function onEmojiClick(btn) {
    //pick emoji add as aline and render to canvas

}

function onAddLine() {
    addLine(gCanavsCenter)
    renderMeme()
}

function keyUpHandler(event) {
    if (gTxtBoxFoucs) return
    const keyPress = event.key
    if (keyPress === 'Backspace') {
        remomveLetter()
    }
    else
        setLineTxt(keyPress, false)
    renderMeme()


}

function onTxtAlign(align) {

}


//img download

function downloadMeme(elLink) {
    const imgContent = gElCanvas.toDataURL()
    elLink.href = imgContent
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
