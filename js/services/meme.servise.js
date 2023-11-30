'use strcit'

const STORAGE_KEY_IMG = 'imgDB'
const STORAGE_KEY_MEME = 'memDB'

var gImgs
var gcurrImg
var gCurrPageIdx = 0
var gCurrLine


// var gMeme = {
//     selectedImgId: 0,
//     memeUrl: '',
//     selectedLineIdx: 0,
//     lines: []
// }
var gMeme = {
    selectedImgId: 0,
    memeUrl: '',
    selectedLineIdx: 0,
    lines: [
        // {
        //     // pos: { x: 20, y: 20 },
        //     // txt: 'I sometimes eat Falafel',
        //     // size: 20,
        //     // color: 'red',
        //     // isCLicked: false,
        // }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

_createImges()

// function getImges() {
//     return gImgs.map(img => img.url)
// }
// function addLine(pos) {
//     gMeme.lines.push(createLine(pos))
// }

function isInTxtArea(pos) {
    debugger
    console.log(gMeme.lines[0].txt.width)
    console.log(gMeme.lines[0].txt.height)
    console.log(gMeme.lines[0].txt)
    gCurrLine = gMeme.lines.findIndex(line => {
        (pos.x >= line.pos.x &&
            pos.x <= line.pos.x + line.txt.width &&
            pos.y >= line.pos.y - line.txt.height &&
            pos.y <= line.txt.y);
    })
    if (gCurrLine >= 0) {
        setIsClicked(gCurrLine)
        return true
    }
    return false
}

function setIsClicked(idx, isClicked) {
    gMeme.lines[idx].isCLicked = isClicked
}

function addLine(pos, txt = 'enter meme', size = 20, color = 'red') {
    gMeme.lines.push({ pos, txt, size, color })
}

function isLineClicked(idx) {
    return gMeme.lines[idx].isCLicked
}

//getters
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
    return gMeme
}

//setters

// function setLineTxt(txt, lineIdx) {

//     gMeme.lines[lineIdx].txt = txt
// }

function setLineTxt1(txt, lineIdx = 0) {

    gMeme.lines[lineIdx].txt += txt
}

function remomveLetter(lineIdx = 0) {
    var str = gMeme.lines[lineIdx].txt
    str = str.substring(0, str.length - 1)
    gMeme.lines[lineIdx].txt = str
    // console.log(gMeme.lines[lineIdx].txt)

}

function setPos(pos, idx) {
    gMeme.lines[ids].pos = pos

}

function getPos(idx) {
    gMeme.lines[idx].pos
}

function setImg(imgId) {
    gcurrImg = getImgById(imgId)
}

function setColor(color) {
    gMeme.lines[0].color = color

}

function setFontSize(size) {
    gMeme.lines[0].size = size
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


