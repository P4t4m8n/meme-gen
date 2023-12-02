'use strcit'

const STORAGE_KEY_IMG = 'imgDB'
const STORAGE_KEY_MEMES = 'memesDB'
const STORAGE_KEY_WORDS = 'keywordsDB'

var gImgs
var gCurrImg
var gCurrPageIdx = 0
var gCurrMemeIdx = 0
var gCurrLine = 0
var gFilterBy = ''
var gMeme

var gKeywords = []
var gDeletedLines = []
var gMemes
var gFonts = ['impact', 'impacted', '.unicode.impacted', 'ruluko']

_createMemes()
_createImges()
_createKeywords()

//user storge

function saveCurrMeme() {
    if (!gMemes) gMemes = []

    var memeSaveIdx = getMemeIdxById(gMeme.id)
    if (memeSaveIdx < 0) gMemes.push(gMeme)
    else gMemes[memeSaveIdx] = gMeme

    _saveItemsToStorge(STORAGE_KEY_MEMES, gMemes)
    
    return true
}

//boolean func

function isInTxtArea(clickedPos) {

    const x = clickedPos.x
    const y = clickedPos.y

    var isInIdx = gMeme.lines.findIndex(line => {

        const lineLength = line.txtWidth
        const lineHeight = line.txtHeight
        const linePos = line.pos

        if (line.align === 'left') {
            if (x >= linePos.x && x <= linePos.x + lineLength && y >= linePos.y - (lineLength / 2) && y <= linePos.y + (lineLength / 2))
                return true
        }
        else if (line.align === 'right') {
            if (x <= linePos.x && x >= linePos.x - lineLength && y >= linePos.y - (lineLength / 2) && y <= linePos.y + (lineLength / 2))
                return true
        }
        else {
            if (x >= linePos.x - (lineLength / 2) && x <= linePos.x + (lineLength / 2) && y >= linePos.y - (lineHeight / 2) && y <= linePos.y + (lineHeight / 2))
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

//add remove

function addNewMeme(imgId) {
    gCurrImg = getImgById(imgId)
    var imgUrl = gCurrImg.url
    setImg(imgId)
    gMeme = _createMeme(imgId, imgUrl)
    addLine()
}

function addLine(pos = { x: 150, y: 75 }, txt = 'enter meme', size = 48, color = 'red', txtWidth = 5, txtHeight = 5, isMarked = true, isClicked = false, align = 'center', font = 'impact') {
    if (gMeme.lines.length > 0) setIsMarked(false)

    gCurrLine = gMeme.lines.push({ pos, txt, size, color, txtWidth: txtWidth, txtHeight, isMarked, isClicked, align, }) - 1
}

function remomveLetter(idx = gCurrLine) {
    var str = gMeme.lines[idx].txt
    str = str.substring(0, str.length - 1)
    gMeme.lines[idx].txt = str

}

function addKeyword(keyword) {

    var keyObj = { key: keyword, size: 24 }

    if (!gCurrImg.keywords.find(key => {

        return key.key === keyword
    })) gCurrImg.keywords.push(keyObj)
    if (!gKeywords.find(key => {

        return key.key === keyword
    })) gKeywords.push(keyObj)


    saveToStorage(STORAGE_KEY_IMG, gImgs)
    saveToStorage(STORAGE_KEY_WORDS, gKeywords)

}

function removeLine() {
    const deletedLine = gMeme.lines.splice(gCurrLine, 1)
    gDeletedLines.push(deletedLine)
    if (gMeme.lines.length > 0) gCurrLine = 0
    return gDeletedLines

}

//getters

function getFonts() {
    return gFonts
}

function getPos(idx = gCurrLine) {

    gMeme.lines[idx].pos
}

function getMemeIdxById(memeId) {
    return gMemes.findIndex(meme => meme.id === memeId)
}
function getImgs() {
    var imges = gImgs

    if (gFilterBy !== '')
        var imges = gImgs.filter((img) => {
            return img.keywords.find(keyword => {
                return keyword.key.startsWith(gFilterBy)
            })
        })

    return imges
}

function getCurrImg() {
    return gCurrImg
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

function getKeywords() {
    return gKeywords
}

function getMemes() {
    return gMemes
}

//setters

function setMeme() {
    gMeme = gMemes[0]
    setImg(gMeme.selectedImgId)
}

function setCurrMeme(isUp = true) {

    if (isUp) gCurrMemeIdx++
    else gCurrMemeIdx--

    if (gCurrMemeIdx >= gMemes.length) gCurrMemeIdx = 0
    if (gCurrMemeIdx < 0) gCurrMemeIdx = gMemes.length - 1

    gMeme = gMemes[gCurrMemeIdx]
    setImg(gMeme.selectedImgId)

    return gCurrMemeIdx
}

function setFont(font) {
    gMeme.lines[gCurrLine].font = font
}

function setTxtAlign(align, idx = gCurrLine) {
    gMeme.lines[idx].align = align
}

function setFilterBy(key) {
    gFilterBy = key
    if (gFilterBy === '') return
    var idx = gKeywords.findIndex(keyword => keyword.key === gFilterBy)
    if (idx < 0) return gFilterBy
    gKeywords[idx].size++
    _saveItemsToStorge(STORAGE_KEY_WORDS, gKeywords)
    return gFilterBy

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
    gCurrImg = getImgById(imgId)
    return gCurrImg
}

function setColor(color, idx = gCurrLine) {
    gMeme.lines[idx].color = color

}

function setFontSize(size, idx = gCurrLine) {
    gMeme.lines[idx].size = size
}

function setLineMove(isUp) {
    const direction = (isUp) ? -3 : 3
    // if (gMeme.lines[gCurrLine].pos.y === 400 || gMeme.lines[gCurrLine].pos.y === 0)
    gMeme.lines[gCurrLine].pos.y += direction

    return direction

}

//private func

function _createMeme(selectedImgId, memeUrl) {
    return {
        id: makeId(),
        selectedImgId,
        memeUrl,
        lines: []
    }
}

function _createMemes() {
    gMemes = loadFromStorage(STORAGE_KEY_MEMES)
}

function _createImges() {
    gImgs = loadFromStorage(STORAGE_KEY_IMG)
    if (gImgs && gImgs.length) return

    gImgs = []

    for (var i = 0; i < 18; i++) {
        gImgs.push({
            id: i,
            url: 'img/meme-imgs/' + parseInt(i + 1) + '.jpg',
            keywords: [],
        })

    }
    _saveItemsToStorge(STORAGE_KEY_IMG, gImgs)
}

function _createKeywords() {
    gKeywords = loadFromStorage(STORAGE_KEY_WORDS)
    if (gKeywords && gKeywords.length) return

    gKeywords = []

    gKeywords = [{ key: 'trump', size: 36 }, { key: 'dogs', size: 42 }, { key: 'funny', size: 30 }]
    _saveItemsToStorge(STORAGE_KEY_WORDS, gKeywords)

}

function _saveItemsToStorge(key, arr) {
    saveToStorage(key, arr)
}


