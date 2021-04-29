const grid = document.getElementById('grid-container');
const btnReset = document.getElementById('reset');
const btnUpdateSize = document.getElementById('update-size');
const ddlColor = document.getElementById('color-scheme')
const rainbow = ['rgb(255, 0, 0)', 'rgb(255, 165,0)', 'rgb(255, 255, 0)', 'rgb(0, 128, 0)', 'rgb(0, 0, 255)', 'rgb(143, 0, 255)'];
let darkenNode = []

newGrid();

function removeGrid() {
    document.querySelectorAll('div[title="grid-item"]').forEach(function(a) {
        a.remove();
    });
}

function newGrid() {  
    size = document.getElementById('grid-size').value;
    if (size < 1 || size > 100) {
        alert("Please set grid size to a number between 1 and 100.");
        return
    }
    removeGrid()
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    let pixelList = []
    for (i=0; i<(size**2); i++) {
       const pixel = document.createElement('div')
       pixel.setAttribute('title', 'grid-item');
       pixel.setAttribute('class', 'blank-grid');
       pixel.setAttribute('id', i);
       grid.appendChild(pixel);
       pixelList.push(pixel)
    }
    const hoveredPixel = document.querySelectorAll('div[title="grid-item"]');
    hoveredPixel.forEach(function(item) {
        item.addEventListener('mouseenter', mouseEnter);
        item.addEventListener('mouseleave', mouseLeave);
    });
    resetGrid()
}

function resetGrid() {
    document.querySelectorAll('div[title="grid-item"]').forEach(function(a) { 
        a.setAttribute('class', 'blank-grid');
        a.setAttribute('style', 'background-color: rgb(255, 255, 255)');
    })
    selectDarken()
}

ddlColor.onchange = selectDarken

function selectDarken() {
    if (document.getElementById('color-scheme').value == "darken") {       
        const currentNodes = document.querySelectorAll('div[title="grid-item"]')
        const nodeColors = []
        currentNodes.forEach(function(a) {
            nodeColors.push(convertRGBtoArr(a.style.backgroundColor))
        });
        calcDarken(nodeColors);
    }
}


function calcDarken(nodeColors) {
    let darkenRGB = []
    for (i=0; i<nodeColors.length; i++) {
        for (j=0; j<3; j++) {
            darkenRGB.push(parseInt(nodeColors[i][j])*.1);
        }
        darkenNode.push(darkenRGB);
        darkenRGB = []
    }
    return darkenNode
}


function convertRGBtoArr(str) {
    let rgb = str
    rgb = rgb.substring(4, rgb.length-1)
        .replace(/ /g, '')
        .split(',');
    return rgb
}


function mouseEnter(e) {
    e.target.setAttribute('class', 'mouse-enter');
}
function mouseLeave(e) {
    const ddlColor = document.getElementById('color-scheme')
    
    e.target.setAttribute('class', 'mouse-leave');
    if (ddlColor.value == 'default') {
        e.target.setAttribute('style', 'background-color: rgb(0, 255, 255)');
    } else if (ddlColor.value == 'rainbow') {   
        if (i >= 6) {
            i = 0;
        }
        e.target.style = `background-color: ${rainbow[i]}`;
        i++;
    } else if (ddlColor.value == 'darken') {
        let amountToDarken = darkenNode[e.target.id];
        let currentColor = convertRGBtoArr(e.target.style.backgroundColor);
        let darkenedColor = [];
        for (i=0; i<3; i++) {
            darkenedColor.push(parseInt(currentColor[i]) - amountToDarken[i]);
        }
        e.target.style.backgroundColor = `rgb(${darkenedColor})`
    }
}

btnReset.addEventListener('click', resetGrid);
btnUpdateSize.addEventListener('click', newGrid);