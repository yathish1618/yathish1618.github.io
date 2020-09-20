var tableDataOrig;
var tableData, dates;
var topRow, bottomRow, mapArray, col1;
var inputChanged = 0;
var inputParsed = 0;
var searchMatches = [],
    msgArray;
var searchCounter = -1;
//mapArray has image links
Papa.parse("link-substitutions.csv", {
    download: true,
    complete: function(results) {
        mapArray = results.data;
        col1 = mapArray.map(function(value, index) { return value[0]; }); //get only first column
    }
});

function parseInputCSV(data) {
    var file = document.getElementById('csv-file').files[0];
    Papa.parse(file, {
        download: true,
        complete: function(results) {
            tableDataOrig = results.data;
            inputParsed = 1;
            processConfig(data);
        }
    });
}

function clearTbody() {
    var node = document.getElementById("tbody");
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    } //clear any existing rows 
}

function processConfig(data) {
    resetSearch();
    if (inputChanged) {
        parseInputCSV(data);
        inputChanged = 0;
    }
    if (inputParsed) {
        closeForm();
        clearTbody();
        document.body.classList.add("loading");
        var checkedFlags = getCheckedFlags();
        if (checkedFlags.length == 6) {
            tableData = tableDataOrig;
        } else {
            tableData = filterTableData(tableDataOrig, checkedFlags);
        }
        dates = tableData.map(function(value, index) { return value[8]; });
        dates = dates.map(x => new Date(x));

        var index = closestDate(dates, data.dt.value);

        topRow = (index - 200 >= 0) ? index - 200 : 0;
        bottomRow = (index + 200 <= tableData.length) ? index + 200 : tableData.length;

        createTable(tableData.slice(topRow, bottomRow), 1);

        //Scroll to appropriate row since we're prepending/appending rows
        var tr = table.getElementsByTagName("tr")[index - topRow];
        tr.scrollIntoView(true);
        document.body.classList.remove("loading");
    }
}

function loadEverything() {
    if (inputChanged) {
        var file = document.getElementById('csv-file').files[0];
        Papa.parse(file, {
            download: true,
            complete: function(results) {
                tableDataOrig = results.data;
                inputParsed = 1;
                loadEverything();
            }
        });
        inputChanged = 0;
    }
    if (inputParsed) {
        document.body.classList.add("loading");
        closeForm();
        clearTbody();
        tableData = tableDataOrig;
        topRow = 0;
        bottomRow = tableData.length;
        setTimeout(function() { //to escape call stack as below line takes lots of time
            createTable(tableData.slice(topRow, bottomRow), 1);
            var tr = table.getElementsByTagName("tr")[0];
            tr.scrollIntoView(true);
            document.body.classList.remove("loading");
        }, 0);
    }
}

function filterTableData(tableDataOrig, checkedFlags) {
    var result = [];
    for (var i = 0; i < tableDataOrig.length; i++) {
        if (checkedFlags.indexOf(tableDataOrig[i][7]) > -1) {
            result.push(tableDataOrig[i]);
        }
    }
    return result;
}

function closestDate(dates, intrstdDt) {
    var datesAsNum = dates.map(Number);
    var sdf = new Date(intrstdDt); 
    var sdb = new Date(intrstdDt);
    sdf.setHours(0, 0, 0, 0); //must ignore time of the dat. coz compare only dates
    sdb.setHours(0, 0, 0, 0);
    if (datesAsNum.indexOf(+sdf) > -1) return datesAsNum.indexOf(+sdf);
    var i = 1; //This counter is just to avoid infinite loop.
    do {
        sdf.setDate(sdf.getDate() + 1); //Go forward one day
        a = datesAsNum.indexOf(+sdf); //This mapping has to be done along with + to serialise. Else indexOf won't work for objects
        sdb.setDate(sdb.getDate() - 1); //Go back one day
        b = datesAsNum.indexOf(+sdb);
        i++;
    }
    while (a == -1 && b == -1 && i < 365); //Search for a max of 1 year forward or backward
    if (a > -1) return a;
    if (b > -1) return b;
}

function createTable(tableData, append) {
    var tableBody = document.getElementById('tbody');
    var c = document.createDocumentFragment();
    tableData.forEach(function(rowData, idx) {
        var row = document.createElement('tr');
        var flag = rowData[7];
        var tmstmp = rowData[8];
        var mdORyd = (rowData[2] == "Md:") ? "md" : "yd";
        var dispDtMd = (rowData[0] != "") ? "dispDtMd" : "";
        var dispDtYd = (rowData[6] != "") ? "dispDtYd" : "";
        rowData.forEach(function(cellData, idx, array) {
            if (idx <= array.length - 3) { //Skip last two columns
                var cell = document.createElement('td');
                switch (idx) {
                    case 0:
                        cell.className = dispDtMd + flag;
                        break;
                    case 1:
                        cell.className = "tm" + mdORyd + flag;
                        cell.setAttribute('title', tmstmp);
                        break;
                    case 2:
                        cell.className = mdORyd + flag;
                        break;
                    case 3:
                        cell.className = "msg" + mdORyd + flag;
                        break;
                    case 4:
                        cell.className = mdORyd + flag;
                        break;
                    case 5:
                        cell.className = "tm" + mdORyd + flag;
                        cell.setAttribute('title', tmstmp);
                        break;
                    case 6:
                        cell.className = dispDtYd + flag;
                }
                if (cellData.indexOf("<img src") > -1) { //if emoji or images are there insert as HTML
                    //search for assets/something.jpg strings and replace - loop for multiple instances in same string
                    var filename = cellData.match(/"assets\/(.*?)"/);
                    do {
                        try {
                            cellData = cellData.replace("assets/" + filename[1], "https://i.imgur.com/" + mapArray[col1.indexOf(filename[1])][1]);
                        } catch (err) { throw cellData; }
                        filename = cellData.match(/"assets\/(.*?)"/);
                    }
                    while (filename != null);
                    cell.innerHTML = cellData;
                } else {
                    cell.appendChild(document.createTextNode(cellData));
                }
                row.appendChild(cell);
            }
        });
        if (append == 2) { //2 means we have to prepend
            c.appendChild(row); //we'll insertBefore all the rows at a time - performance boost
        } else {
            tableBody.appendChild(row);
        }
    });
    if (append == 2) {
        tableBody.insertBefore(c, tableBody.childNodes[0]);
    }
    console.log("Position: "+bottomRow+" / "+tableDataOrig.length+" = "+(bottomRow*100/tableDataOrig.length).toFixed(2)+"%");
}

window.onscroll = function(ev) {
    //Bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (bottomRow != tableData.length) {
            var bottomRowTemp = bottomRow;
            bottomRow += 200;
            if (bottomRow > tableData.length) bottomRow = tableData.length;
            createTable(tableData.slice(bottomRowTemp, bottomRow), 1);
        }
    }
    //Top
    if (window.scrollY < 10) {
        if (topRow != 0) {
            var topRowTemp = topRow;
            topRow -= 200;
            if (topRow < 0) topRow = 0;
            createTable(tableData.slice(topRow, topRowTemp), 2);
        }
    }
};

// When the user clicks on the button, scroll to the top of the document
function openForm() {
    document.getElementById("myForm").style.display = "block";
    closeSearch();
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function openSearch() {
    document.getElementById("searchForm").style.display = "block";
    document.getElementById("search").focus();
    closeForm();
}

function closeSearch() {
    document.getElementById("searchForm").style.display = "none";
}

function changeInputFile() {
    inputChanged = 1;
}

function getCheckedFlags() {
    var temp;
    var checkedValues = [];
    var inputElements = document.getElementsByClassName('chkbox');
    for (var i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            temp = inputElements[i].value;
            checkedValues.push(temp);
        }
    }
    return checkedValues;
}

function resetSearch() {
    searchCounter = -1; //reset search counter
    searchMatches = [];
}

function searchNext() {
    var string = document.getElementById('search').value;
    if (searchMatches.length > 0) {
        if (searchCounter == searchMatches.length - 1) searchCounter = -1; //end of results reached. Restart from 0
        searchCounter += 1;
        if (searchCounter < searchMatches.length) {
            populateSearchResult(searchMatches[searchCounter]);
        }
    } else {
        if (string != ""){
            msgArray = tableData.map(function(value, index) { return value[3]; });
            searchMatches = getMatches(msgArray, string);
        } 
        if (searchMatches.length > 0) {
            searchCounter = 0;
            populateSearchResult(searchMatches[searchCounter]);
        }
    }
}

function searchPrev() {
    var string = document.getElementById('search').value;
    if (searchMatches.length > 0) {
        if (searchCounter == 0) searchCounter = searchMatches.length; //end of results reached. Restart from 0
        searchCounter -= 1;
        if (searchCounter < searchMatches.length) {
            populateSearchResult(searchMatches[searchCounter]);
        }
    }
}

function populateSearchResult(ind) {
    clearTbody();
    var index = ind;
    topRow = (index - 100 >= 0) ? index - 100 : 0;
    bottomRow = (index + 100 <= tableData.length) ? index + 100 : tableData.length;
    createTable(tableData.slice(topRow, bottomRow), 1);
    //To highilght search matches
    var string = document.getElementById('search').value;
    var toHighlight = table.getElementsByTagName("tr")[index - topRow].cells[3].innerHTML;
    var highlightedHTML = toHighlight.replace(new RegExp('('+string+')', "gi"), "<span class='highlight'>$1</span>"); //"gi" is to replace all matches (global) and case insensitive (i); Also used capturing group to retain case
    table.getElementsByTagName("tr")[index - topRow].cells[3].innerHTML = highlightedHTML;
    //Scroll with a few rows at the top - corner case handled
    if (index - topRow - 5 >= 0) {
        var tr = table.getElementsByTagName("tr")[index - topRow - 5];
        tr.scrollIntoView(true);
    } else {

        var tr = table.getElementsByTagName("tr")[index - topRow];
        tr.scrollIntoView(true);
    }
    //Update search box display counter
    var cs = document.getElementsByClassName('currentSearch');
    cs[0].innerText = searchMatches.indexOf(index) + 1 + "/" + searchMatches.length;
}

function getMatches(a, regex) {
    var matches = [];
    var regr = new RegExp(regex,"i")
    for (var i = 0; i < a.length - 1; i++) {
        if (a[i].search(regr) > -1) { //"i" is for case insensitive search
            matches.push(i);
        };
    };
    if (matches.length == 0) {
        var cs = document.getElementsByClassName('currentSearch');
        cs[0].innerText = "No Matches :(";
    }
    return matches;
};