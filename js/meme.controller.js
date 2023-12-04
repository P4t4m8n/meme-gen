'use strcit'

var gElCanvas = document.querySelector('canvas')
var gCtx = gElCanvas.getContext('2d')
var gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
var gMousePos
var gTxtBoxFoucs = false
var gIsDownload = false
var test

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
    gCtx.strokeStyle = 'white'
    if (txtInfo.isMarked) {
        if (txtInfo.align === 'left') gCtx.strokeRect(x, y - height, measures.width, height)

        else if (txtInfo.align === 'right') gCtx.strokeRect(x - measures.width, y - height, measures.width, height + 5)
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
    addLine()
    renderMeme()
}

//line editor

function onLineMove(isUp) {
    setLineMove(isUp)
    renderMeme()
}

function onSetAlign(align) {
    // const align = btn.innerText
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
    console.log(pos)
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
    console.log(elLink)
    // removeAllMarked()
    // renderMeme()


    // const imgContent = gElCanvas.toDataURL()
    // elLink.href = imgContent
    console.log(elLink)
}

function delay(x) {
    setTimeout(function () {
        const imgContent = gElCanvas.toDataURL()
        x = imgContent
    }, 2000);
}

//general  func

function onBoxFoucs() {
    gTxtBoxFoucs = !gTxtBoxFoucs
}

function _OnAddKeyword() {
    addKeyword(prompt('enter'))
}

function onUploadImg() {
    // Gets the image from the canvas
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') 

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

// Upload the image to a server, get back a URL 
// call the function onSuccess when done
function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        // Same as
        // const url = XHR.responseText

        // If the response is ok, call the onSuccess callback function, 
        // that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}




