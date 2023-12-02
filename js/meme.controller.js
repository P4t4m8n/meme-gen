'use strcit'

var gElCanvas = document.querySelector('canvas')
var gCtx = gElCanvas.getContext('2d')
var gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
var gMousePos
var gTxtBoxFoucs = false

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

// const NO_IMG_SELECTED = {
//     txtInfo: {
//         txt: 'NO MEME SELECTED',
//         color: 'red',
//         size: 60,
//         font: 'inter',
//         align: 'center',
//     }
// }



//render func

function renderMeme() {
    if (!getCurrImg()) {
        setMeme()
    }
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

function renderFontsList() {
    const fonts = getFonts()
    var strHtml = `<option value="default"></option>`
    strHtml += fonts.map(font => `<option value="${font}">${font}</option>`).join('')

    document.querySelector('.font-list').innerHTML = strHtml
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

//line creator

function drawText(lineInfo, x, y) {

    var txtInfo = lineInfo
    var memeTxt = txtInfo.txt

    gCtx.fillStyle = txtInfo.color
    gCtx.font = txtInfo.size.toString() + 'px ' + txtInfo.font

    gCtx.textAlign = txtInfo.align

    let measures = gCtx.measureText(memeTxt);
    let height = measures.actualBoundingBoxAscent + measures.actualBoundingBoxDescent;

    setLineWidth(measures.width)
    setLineHeight(height)

    gCtx.fillText(memeTxt, x, y)
    // gCtx.strokeText(memeTxt, x, y, 400)

    if (txtInfo.isMarked) {
        if (txtInfo.align === 'left') gCtx.strokeRect(x, y - height, measures.width, height)

        else if (txtInfo.align === 'right') gCtx.strokeRect(x - measures.width , y - height, measures.width, height)
        else gCtx.strokeRect(x - (measures.width / 2), y - height, measures.width, height)


    }
}

function onEmojiClick(el) {
    const emoji = el.innerText
    var isNewLine = confirm('New line?')
    if (isNewLine) addLine(gCanavsCenter, emoji)
    else setLineTxt(emoji, false)
    renderMeme()
}

function onAddLine() {
    addLine(gCanavsCenter)
    renderMeme()
}

//line editor

function onLineMove(isUp) {
    setLineMove(isUp)
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

function onRemoveLine() {
    removeLine()
    renderMeme()
}

//txt editor

function onSetLineTxt(el) {
    const txt = el.value
    setLineTxt(txt, true)
    renderMeme()
}

//Listeners

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    addOpenFontModalListener()
    addSaveClickListener()
    addStorgeOpenModalListener()

    window.addEventListener("keyup", keyUpHandler, true)
    window.addEventListener('resize', () => {
        resizeCanvas()
        const gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
        renderMeme()
    })
}

function addSaveClickListener() {
    const saveMeme = document.querySelector('.save-meme')
    saveMeme.addEventListener('click', () => {
        var isSaved = saveCurrMeme()
    })
}

function addStorgeOpenModalListener() {
    var elOpenBtn = document.querySelector('.next-meme')
    elOpenBtn.addEventListener('click', () => {
        setCurrMeme()
        renderMeme()
    })

}

function addOpenFontModalListener() {

    renderFontsList()

    const elFontChange = document.querySelector('.font-change')
    const elOpenModel = document.querySelector('.open-font-modal-btn')
    const elSelectFont = document.querySelector('.font-list')
    const elConfirmBtn = document.querySelector('.confirm-btn')


    elOpenModel.addEventListener('click', () => {
        elFontChange.showModal()
    })

    elSelectFont.addEventListener('change', (elFont) => {
        elConfirmBtn.value = elSelectFont.value
    })

    elFontChange.addEventListener("close", (elFont) => {
        setFont(elFontChange.returnValue)
    })

    elConfirmBtn.addEventListener("click", (event) => {
        event.preventDefault();
        elFontChange.close(elSelectFont.value);
    })

    renderMeme()
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

//events

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

function keyUpHandler(ev) {
    if (gTxtBoxFoucs) return
    ev.preventDefault()
    const keyPress = ev.key

    if (keyPress === 'ArrowLeft' || keyPress === 'ArrowRight' || keyPress === 'Shift' || keyPress === 'Alt') return

    if (keyPress === 'ArrowUp') {
        onLineMove(true)
        return
    }
    if (keyPress === 'ArrowDown') {
        onLineMove(false)
        return
    }

    if (keyPress === 'Backspace' || keyPress === 'Delete') {
        remomveLetter()
    }
    else
        setLineTxt(keyPress, false)
    renderMeme()
}

//canvas positioning

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

//img download

function downloadMeme(elLink) {
    removeAllMarked()
    renderMeme()
    const imgContent = gElCanvas.toDataURL()
    elLink.href = imgContent
}



//general  func

function onBoxFoucs() {
    gTxtBoxFoucs = !gTxtBoxFoucs
}

function _OnAddKeyword() {
    addKeyword(prompt('enter'))
}
