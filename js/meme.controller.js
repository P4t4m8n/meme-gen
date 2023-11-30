'use strcit'

var gElCanvas = document.querySelector('canvas')
var gCtx = gElCanvas.getContext('2d')
var gLineIdx = 1
var gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']



//

function renderMeme() {
    const imgUrl = getCurrImg().url
    var imgContent = getMeme().lines

    if (imgContent) addLine(gCanavsCenter)
    imgContent = getMeme().lines

    var imgObj = new Image()

    imgObj.onload = function () {
        gCtx.drawImage(imgObj, 0, 0, gElCanvas.width, gElCanvas.height)

        if (imgContent) {
            imgContent.forEach(line => {
                var { pos } = line
                drawText(line, pos.x, pos.y)
            })
        }

    }
    imgObj.src = imgUrl
    resizeCanvas()

    // renderLines()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}
// function renderMeme() {
//     const imgUrl = getCurrImg().url
//     const imgContent = getMeme().lines
//     var imgObj = new Image()
//     // console.log(imgUrl)

//     imgObj.onload = function () {
//         gCtx.drawImage(imgObj, 0, 0, gElCanvas.width, gElCanvas.height)
//         var gap = 0
//         imgContent.forEach(line => {
//             drawText(line, 0, 10 + gap)
//             gap += 5
//         })

//     }
//     imgObj.src = imgUrl
//     renderLines()
// }

function renderLines() {
    const lines = document.querySelectorAll('.meme-txt')
    const memeLines = getMeme().lines

    for (var i = 0; i < memeLines.length; i++) {
        // console.log(lines[i].value)
        // console.log(memeLines[i].txt)
        lines[i].value = memeLines[i].txt
    }
}

//txt manger

function drawText(txtInfo, x, y) {

    var memeTxt = txtInfo.txt

    gCtx.fillStyle = txtInfo.color
    gCtx.font = txtInfo.size.toString() + 'px Arial'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(memeTxt, x, y)
    console.log(gCtx.measureText(memeTxt).width)
    console.log(gCtx.measureText(memeTxt).height)
}

// function onAddLine() {

//     var lineStr = ` <label>
//                     <input class="meme-txt" type="text" name="meme-txt" value="enter txt" data-cell-idx="${gLineIdx}"
//                     oninput="onSetLineTxt(this)" />
//                     </label>`

//     var tempInnerHtml = document.querySelector('.txt-boxs').innerHTML + lineStr
//     document.querySelector('.txt-boxs').innerHTML = tempInnerHtml
//     addLine()
//     gLineIdx++
// }

function onLineMove(isUp) {
    console.log(isUp)
}

function onSetLineTxt(el) {
    const txt = el.value
    const idx = el.dataset.cellIdx
    // console.log(idx)
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
    //Listen for resize ev
    window.addEventListener('resize', () => {
        resizeCanvas()
        //Calc the gCanavsCenter of the canvas
        const gCanavsCenter = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
        renderCanvas()
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
    console.log('onDown')
    // Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
    // console.log('pos', pos)
    // debugger
    var t = isInTxtArea(pos)
    console.log(t)
    
    //Save the pos we start from
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  
    const pos = getEvPos(ev)
    // console.log('pos', pos)
    // Calc the delta, the diff we moved
    // const dx = pos.x - gStartPos.x
    // const dy = pos.y - gStartPos.y
    // moveCircle(dx, dy)
    // Save the last pos, we remember where we`ve been and move accordingly
    // gStartPos = pos
    // The canvas is render again after every move
    renderCanvas()
}

function onUp() {
    // console.log('onUp')
    setCircleDrag(false)
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        // Prevent triggering the mouse ev
        ev.preventDefault()
        // Gets the first touch point
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
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
    console.log(keyPress)
    if (keyPress === 'Backspace') {
        console.log('hi')
        remomveLetter()

    }
    else
        setLineTxt1(keyPress)

    renderMeme()


}


//img download

function downloadMeme(elLink) {
    const imgContent = gElCanvas.toDataURL() // image/jpeg the default format
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
