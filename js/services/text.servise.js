var gCurrLine


function createLine(pos) {
    gCurrLine = {
        pos,
        txt: 'I like Falafel',
        size: 20,
        color: 'red',
        isDrag: false
    }

    return gCurrLine
    // return {
    //     pos,
    //     txt:'I like Falafel',
    //     size: 20,
    //     color: 'red',
    //     isDrag: false
    // }
}

function getLine() {
    return gCurrLine
}

function setCurrLine(line) {
    gCurrLine = line
}


function isLineClicked(clickedPos) {
    const { pos } = gCurrLine
    // Calc the distance between two dots
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    // console.log('distance', distance)
    //If its smaller then the radius of the circle we are inside
    return distance <= gCurrLine.size
}


function setLineDrag(isDrag) {
    gCurrLine.isDrag = isDrag
}

// Move the circle in a delta, diff from the pervious pos
function moveLine(dx, dy) {
    gCurrLine.pos.x += dx
    gCurrLine.pos.y += dy
}