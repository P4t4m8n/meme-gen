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

function addLine(pos = { x: '50', y: '50' }, txt = 'enter meme', size = 20, color = 'red', txtWidth = 5, txtHeight = 5, isMarked = false, isClicked = false) {
    gMeme.lines.push({ pos, txt, size, color, txtWidth: txtWidth, txtHeight, isMarked, isClicked })
}

function isInTxtArea(clickedPos) {

    const x = clickedPos.x
    const y = clickedPos.y

    var isInIdx = gMeme.lines.findIndex(line => {
        const lineLength = line.txtWidth
        const lineHeight = line.height
        const linePos = line.pos
        if (x <= linePos.x + lineLength && x + 10 >= linePos.x && y <= linePos.y + lineHeight &&
            y >= linePos.y - lineHeight) {
            return true
        }
    })

    if (isInIdx >= 0) {
        gCurrLine = isInIdx
        setIsClicked(true)
        return true
    }
    return false
}

function isLineClicked(idx = gCurrLine) {
    return gMeme.lines[idx].isClicked
}

function remomveLetter(lineIdx = 0) {
    var str = gMeme.lines[lineIdx].txt
    str = str.substring(0, str.length - 1)
    gMeme.lines[lineIdx].txt = str

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

<<<<<<< HEAD
=======

//setters

function setPos(pos, idx = gCurrLine) {
    gMeme.lines[idx].pos = pos
}

function setIsClicked(isClicked, idx = gCurrLine) {
    gMeme.lines[idx].isClicked = isClicked
}

function setLineTxt(txt, lineIdx = 0) {
    gMeme.lines[lineIdx].txt += txt
}

function setLineHeight(height, idx = gCurrLine) {
    gMeme.lines[idx].height = height
}

function setLineWidth(width, idx = gCurrLine) {
    gMeme.lines[idx].txtWidth = width
}

>>>>>>> changes
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


