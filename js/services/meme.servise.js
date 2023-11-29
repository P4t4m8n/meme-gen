'use strcit'

var gImgs = [{ id: 1, url: 'img/1.png', keywords: ['funny', 'cat'] }]

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red'
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMemeImg(memeImgId) {
    var t = gImgs.find(img => memeImgId === img.id).url
    return t
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[0].txt = txt
}