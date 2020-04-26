const boxClass = "box"
const boxName = "decoderTile"


const noAsssassin = "noAsssassin";
const singleAsssassin = "singleAsssassin";
const multipleAssassin = "multipleAssassin";

const columnString = "Colums: "
const rowString = "Rows: "
assassinString= "Assassins: "

function colorizeDecoderTiles(boxIds, startIndex, indexCount, color) {
    let lastIndex = startIndex;
    for (let i = startIndex; i < startIndex + indexCount; i++) {
        let selectedBox = document.getElementById(boxIds[i]);
        selectedBox.style.backgroundColor = color;
        lastIndex = i;
    }
    return lastIndex;
}

function createBox(id) {
    var newBox = document.createElement("div");
    newBox.setAttribute("class", boxClass)
    newBox.setAttribute("id", id)
    return newBox;
}

function updateDecoder() {
    let columnCount = document.getElementById("columnCount").value;
    let rowCount = document.getElementById("rowCount").value;
    let seedValue = document.getElementById("seedValueInput").value;

    let myrng = new Math.seedrandom(seedValue.toUpperCase());

    let count = columnCount * rowCount;

    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    maxWidthInFr =(height / rowCount) / width;
    maxHeightInFr = (width / columnCount) / height;

    let fractionPerColumn = 0.8 * Math.min(maxWidthInFr, maxHeightInFr)

    let grid = updateDecoderGrid(columnCount, fractionPerColumn);

    let boxIds = [];
    for (let i = 0; i < count; i++) {
        let boxIndex = i;
        let box = createBox(boxName + boxIndex);
        grid.appendChild(box);
        boxIds.push(box.id);
        boxIds.sort(function (a, b) { return 0.5 - myrng() });
    }

    let teamOneTileCounts = count * 0.36;
    let teamTwoTileCounts = teamOneTileCounts - 1;

    colors = ["rgb(40, 122, 230)", "rgb(236, 76, 47)"]
    colors.sort(function (a, b) { return 0.5 - myrng() });
    document.getElementById("startingTeam").style.backgroundColor = colors[0];
    document.getElementById("decoderGrid").style.borderColor = colors[0];
    startIndex = 0;
    let lastIndexTeamOne = colorizeDecoderTiles(boxIds, startIndex, teamOneTileCounts, colors[0]);
    let lastIndexTeamTwo = colorizeDecoderTiles(boxIds, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
    let lastIndexAssassin = colorizeDecoderTiles(boxIds, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), "rgb(35, 37, 37)");

    updateUrl();
    return false;
}

function updateDecoderGrid(columns, fractionPerColumn) {
    let grid = document.getElementById("decoderGrid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = createGridcolumnsPropertyValue(columns, fractionPerColumn);
    return grid;
}

function createGridcolumnsPropertyValue(columns, fractionPerColumn) {
    /* var config = "";
    for (let i = 0; i < columns - 1; i++) {
        config += "1fr "
    }
    config += "1fr" */
    let config = `repeat( ${columns}, ${fractionPerColumn * 100}%)`;
    return config;
}

function initialize() {

    var rowCount = getUrlVars()["rowCount"];
    var columnCount = getUrlVars()["columnCount"];
    var assassinCount = getUrlVars()["assassinCount"];
    var session = getUrlVars()["session"];
    if(rowCount !== undefined && columnCount !== undefined && assassinCount != undefined && session != undefined){
        localStorage.rowCount = rowCount;
        localStorage.columnCount = columnCount;
        localStorage.assassinCount = assassinCount;
        localStorage.seedValue = session;
    }


    let rowCountElement = document.getElementById("rowCount");
    if (localStorage.rowCount) {
        rowCountElement.value = localStorage.rowCount;
    }
    onRowCountInputChanged(rowCountElement.value)

    let columnCountElement = document.getElementById("columnCount");
    if (localStorage.columnCount) {
        columnCountElement.value = localStorage.columnCount;

    }
    onColumnCountInputChanged(columnCountElement.value);

    let seedValueElement = document.getElementById("seedValueInput");
    if (localStorage.seedValue) {
        seedValueElement.value = localStorage.seedValue;
    } else {
        seedValueElement.value = Math.random();
    }
    onSeedValueChanged(seedValueElement.value);

    let assassinCountElement = document.getElementById("assassinCount");
    if (localStorage.assassinCount) {
        assassinCountElement.value = localStorage.assassinCount;
    }
    onAssassinCountInputChanged(assassinCountElement.value);
}

function getAssassinSetting() {
    let assassinSetupRadioGroup = document.getElementsByName("assassinSetup")
    var selectedSetting;

    for (let i = 0; i < assassinSetupRadioGroup.length; i++) {
        if (assassinSetupRadioGroup[i].checked) {
            selectedSetting = assassinSetupRadioGroup[i].value;
        }
    }

    return selectedSetting;
}


function onRowCountInputChanged(value) {
    localStorage.rowCount = Number(value);
    let rowCountText = document.getElementById("rowCountText");
    rowCountText.innerText = rowString + value
    updateDecoder();
}

function onColumnCountInputChanged(value) {
    localStorage.columnCount = Number(value);
    let columnCountText = document.getElementById("columnCountText");
    columnCountText.innerText = columnString + value
    updateDecoder();
}

function onAssassinCountInputChanged(value) {
    localStorage.assassinCount = Number(value);
    let assassinCountText = document.getElementById("assassinCountText");
    assassinCountText.innerText = assassinString + value
    updateDecoder();
}


function onSeedValueChanged(value) {
    localStorage.seedValue = value;
    updateDecoder();
}

function onRandomizeButtonClicked() {
    let newSeed = Math.random();
    document.getElementById("seedValueInput").value = newSeed;
    onSeedValueChanged(newSeed);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function updateUrl(){    
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set('rowCount', localStorage.rowCount);
    search_params.set('columnCount', localStorage.columnCount);
    search_params.set('assassinCount', localStorage.assassinCount);
    search_params.set('session', localStorage.seedValue);
    url.searchParams = search_params;
    window.history.pushState({path:url.toString()},'',url.toString());
}




