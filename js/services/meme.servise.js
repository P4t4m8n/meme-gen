'use strcit'

const STORAGE_KEY_IMG = 'imgDB'
const STORAGE_KEY_MEME = 'memDB'

var gImgs
var gcurrImg
var gCurrPageIdx = 0


var gMeme = {
    selectedImgId: 0,
    memeUrl: '',
    selectedLineIdx: 0,
    lines: []
}
// var gMeme = {
//     selectedImgId: 0,
//     memeUrl: '',
//     selectedLineIdx: 0,
//     lines: [
//         {
//             txt: 'I sometimes eat Falafel',
//             size: 20,
//             color: 'red'
//         }
//     ]
// }

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

_createImges()

// function getImges() {
//     return gImgs.map(img => img.url)
// }
function addLine(pos) {
    gMeme.lines.push(createLine(pos))
}
// function addLine(txt = 'enter meme', size = 20, color = 'red') {
//     gMeme.lines.push({ txt, size, color })
// }
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

function setLineTxt(txt, lineIdx) {

    gMeme.lines[lineIdx].txt = txt
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
