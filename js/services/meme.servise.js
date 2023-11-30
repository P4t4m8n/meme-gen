'use strcit'

const STORAGE_KEY_IMG = 'imgDB'
const STORAGE_KEY_MEME = 'memDB'

var gImgs
var gcurrImg
var gCurrPageIdx = 0
var gCurrLine = 0

var gMeme = {
    selectedImgId: 0,
    memeUrl: '',
    selectedLineIdx: 0,
    lines: []

}

_createImges()

function addLine(pos = { x: 50, y: 50 }, txt = 'enter meme', size = 48, color = 'red', txtWidth = 5, txtHeight = 5, isMarked = true, isClicked = false, align = 'left') {
    if (gMeme.lines.length > 0) setIsMarked(false)
    gCurrLine = gMeme.lines.push({ pos, txt, size, color, txtWidth: txtWidth, txtHeight, isMarked, isClicked, align }) - 1
   
}

function isInTxtArea(clickedPos) {


    const x = clickedPos.x
    const y = clickedPos.y

    var isInIdx = gMeme.lines.findIndex(line => {
        const lineLength = line.txtWidth
        const lineHeight = line.txtHeight
        const linePos = line.pos

        if (x <= linePos.x + lineLength && x >= linePos.x && y <= linePos.y + lineHeight &&
            y >= linePos.y - lineHeight) {
            return true
        }
    })

    if (isInIdx >= 0) {

        setIsMarked(false)
        gCurrLine = isInIdx
        setIsMarked(true)
        setIsClicked(true)
        return true
    }
    return false
}

function isLineClicked(idx = gCurrLine) {
    return gMeme.lines[idx].isClicked
}

function remomveLetter(idx = gCurrLine) {
    var str = gMeme.lines[idx].txt
    str = str.substring(0, str.length - 1)
    gMeme.lines[idx].txt = str

}

//getters

function getPos(idx = gCurrLine) {

    gMeme.lines[idx].pos
}

function getImgs() {
    return gImgs
}

function getCurrImg() {
    return gcurrImg
}

function getImgById(imgId) {
    return gImgs.find(img => imgId === img.id)
}

function getMeme() {
    if (gMeme.lines.length === 0) {
        addLine()
    }
    return gMeme
}

function getCurrLine() {
    return gMeme.lines[gCurrLine]
}


//setters

function setTxtAlign(align, idx = gCurrLine) {
    // console.log(align)
    // console.log(gMeme.lines[idx].align)
    gMeme.lines[idx].align = align
    // console.log(align)
    // console.log(gMeme.lines[idx].align)
}

function setIsMarked(isMarked, idx = gCurrLine) {
    gMeme.lines[idx].isMarked = isMarked
}
function setPos(pos, idx = gCurrLine) {


    gMeme.lines[idx].pos.x += pos.x
    gMeme.lines[idx].pos.y += pos.y


}

function setIsClicked(isClicked, idx = gCurrLine) {
    gMeme.lines[idx].isClicked = isClicked
}

function setLineTxt(txt, isBox, idx = gCurrLine) {
    if (isBox) gMeme.lines[idx].txt = txt
    else gMeme.lines[idx].txt += txt
}

function setLineHeight(height, idx = gCurrLine) {
    gMeme.lines[idx].txtHeight = height
}

function setLineWidth(width, idx = gCurrLine) {
    gMeme.lines[idx].txtWidth = width
}

function setImg(imgId) {
    gcurrImg = getImgById(imgId)
}

function setColor(color, idx = gCurrLine) {
    gMeme.lines[idx].color = color

}

function setFontSize(size, idx = gCurrLine) {
    gMeme.lines[idx].size = size
}

//private func

function _createImges() {

    gImgs = loadFromStorage(STORAGE_KEY_IMG)
    if (gImgs && gImgs.length) return

    gImgs = []

    for (var i = 0; i < 18; i++) {
        gImgs.push({
            id: i,
            url: 'img/meme-imgs/' + parseInt(i + 1) + '.jpg',
            keywords: ['Funny', 'Stupid']
        })

    }
    _saveImgsToStorge()
}

function _saveImgsToStorge() {
    saveToStorage(STORAGE_KEY_IMG, gImgs)
}


