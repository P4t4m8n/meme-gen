'use strcit'

var gElCanvas = document.querySelector('canvas')
var gCtx = gElCanvas.getContext('2d')
var gLineIdx = 1
var gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
var gMousePos

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']



//render func

function renderMeme() {
    const imgUrl = getCurrImg().url
    var imgContent = getMeme().lines
    // (imgContent)

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
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
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

    gCtx.textAlign = 'left';
    gCtx.textBaseline = 'top';

    let measures = gCtx.measureText(memeTxt);
    let height = measures.actualBoundingBoxAscent + measures.actualBoundingBoxDescent;


    setLineWidth(measures.width)
    setLineHeight(height)

    gCtx.fillText(memeTxt, x, y)

    if (txtInfo.isMarked) gCtx.strokeRect(x, y, measures.width, height + 8)
}

function onLineMove(isUp) {
    // (isUp)
}

function onSetLineTxt(el) {
    const txt = el.value
    const idx = el.dataset.cellIdx
    setLineTxt(txt, idx)
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


function onAddLine() {
    addLine(gCanavsCenter)
    renderMeme()
}

function keyUpHandler(event) {
    const keyPress = event.key
    if (keyPress === 'Backspace') {
        remomveLetter()
    }
    else
        setLineTxt(keyPress)
    renderMeme()


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
