google.charts.load('current', { 'packages': ['line', 'corechart'] });
var imdb_url, code;
var imdbhtml, i;
var movieYear;
var movieName;
var poster;
var waybackAjax, whateveroriginAjax;
var fetchedDate = "";
var dataArr = [
    []
];

var dates;

function populateDates() { //6 month intervals
    var today = new Date();
    var interval = 86400000; //1 day in milliseconds
    var e = document.getElementById("interval");
    var c = e.value;
    if (c == 1) interval *= 30;
    if (c == 2) interval *= 90;
    if (c == 3) interval *= 180;
    if (c == 4) interval *= 365;
    var lowerLim = 978287400000; //20010101
    var year = 2001;
    if (movieYear > 0) {
        year = movieYear;
        var s = new Date(movieYear + "January 01");
        lowerLim = s.getTime();
    }

    var dates = [];
    dates[0] = today.getTime();
    do {
        dates.push(dates[dates.length - 1] - interval);
    }
    while (dates[dates.length - 1] >= lowerLim);
    for (j = 0; j < dates.length; j++) {
        var k = new Date(dates[j]);
        dates[j] = parseInt(k.getFullYear().toString() + (("0" + (k.getMonth() + 1))).slice(-2) + "01");
    }
    var dummy = dates.pop(); //remove last item in array because of do while extra thingy
    return dates;
}
//IMDb founded in 1990 and Waybackmachine in 2001

function process() {
    $('#loadingInfo').html("Loading... ");
    code = searchArr[index]["id"];
    imdb_url = 'https://www.imdb.com/title/' + code + '/';
    movieYear = searchArr[index]["y"];
    movieName = searchArr[index]["l"];
    poster = searchArr[index]["i"][0]; //link to hi-res poster
    poster = poster.replace("._V1_.jpg", "._V1_UX182_CR0,0,182,268_AL__QL50.jpg"); //to get lower resolution poster
    $('#poster img').attr("src", poster);
    $('#poster a').attr("href", imdb_url);
    dates = populateDates();
    i = dates.length - 1;
    $('#chart_div').empty(); //remove existing chart, if any
    g = document.createElement('div');
    g.setAttribute("id", code);
    document.getElementById('chart_div').appendChild(g);
    if (waybackAjax) waybackAjax.abort(); //abort any previous pending requests
    if (whateveroriginAjax) whateveroriginAjax.abort();
    //reset data array
    dataArr = [
        []
    ];
    callWayBackMachine(dates[i]);
}

function callWayBackMachine(timestamp) {
    var cdxUrl = 'http://web.archive.org/cdx/search/cdx?url=' + imdb_url+ '&from=' + timestamp + '&fl=timestamp&limit=1'; //limit 1 basically picks the most recent available date, fl=timestamp means fetch only the timestap field and nothing else.
    waybackAjax = $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(cdxUrl) + '&callback=?', function(data){
            if(data["contents"]!="") {
                var date = data["contents"];
            }
        else {
                $('#loadingInfo').html("No archives found!");
                console.log("No archives found for " + movieName + " (" + imdb_url + ") for " + timestamp);
                waybackAjax.abort();
                return false;
            }
            var url = "http://web.archive.org/web/"+date+"/"+imdb_url;
            if (fetchedDate != date) { //avoid calls to same archived page
                //getRatingData(url, date);
                $('#loading').show();
                $('#loadingInfo').html("Fetching data for " + timestamp + ". Progress: (" + (dates.length - i) + "/" + dates.length + ")");
                whateveroriginAjax = $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?',
                    function(data) {
                        console.log(url);
                        if ($('#loadingInfo').html() == "Done!" || $('#loadingInfo').html() == "&nbsp;") {
                            $('#loadingInfo').html("&nbsp;");
                            $('#loading').hide();
                        }
                        imdbhtml = $($.parseHTML(data.contents));
                        results = fetcher(imdbhtml, date);
                        if (results[0] > 0 && results[1] > 0) { //update data array only if both rating and number of votes are valid 
                            var dt = new Date(Math.floor(date / 10000000000), Number(date.toString().substring(4, 6)) - 1);
                            var rt = results[0];
                            // var tt = Math.floor(date / 10000000000)+"-"+date.toString().substring(4, 6)+"<br><strong>"+rt+"</strong><br>"+results[1] + " Votes";
                            var tt = "<strong>" + rt + "</strong><br>(" + results[1] + " Votes)";
                            if (dataArr[0] == "") { dataArr[0] = [dt, rt, tt]; } else { //js months start from 0! (y,m) given here
                                dataArr.push([dt, rt, tt]);
                            }
                        }
                        var chartDiv = document.getElementById(code);
                        if (chartDiv == null) return false;

                        graphData = new google.visualization.DataTable();
                        graphData.addColumn('date', 'Month');
                        graphData.addColumn('number', "Rating");
                        graphData.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

                        dataArr.sort((function(index) {
                            return function(a, b) {
                                return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
                            };
                        })(0)); //Sort array by first column (index=0) i.e., by date; Else charts goes bollocks
                        if (dataArr[0] == "") {
                            $('#loadingInfo').html("No rating data found for " + timestamp + "!");
                            handleNextCall();
                            fetchedDate = date;
                            return false;
                        }
                        graphData.addRows(dataArr);
                        var materialOptions = {
                            tooltip: { trigger: 'focus', isHtml: true },
                            focusTarget: "category",
                            pointSize: 5,
                            legend: { position: 'none' },
                            chartArea: {
                                left: 50,
                                top: 20,
                                width: '100%',
                                height: '350',
                            },
                            width: 600,
                            height: 400
                        };
                        //var materialChart = new google.charts.Line(chartDiv); 
                        //not using material chart as its still under dev. :(
                        var materialChart = new google.visualization.LineChart(chartDiv);
                        materialChart.draw(graphData, materialOptions);
                        handleNextCall();
                        fetchedDate = date;
                    }).fail(function() {
                    $('#loadingInfo').html("Failed to fetch for " + timestamp + ". Proceeding..");
                    handleNextCall();
                    fetchedDate = date;
                });
            } else {
                handleNextCall();
            }
    })
    .fail(function(data) {
            $('#loadingInfo').html("Connection interrupted. Please submit again!");
            if (waybackAjax) waybackAjax.abort();
    });
}

function handleNextCall() {
    if (i > 0) {
        i--;
        callWayBackMachine(dates[i]);
    } else {
        if ($('#loadingInfo').html() != "No rating data found!") $('#loadingInfo').html("Done!");
        $('#loading').hide();
    }
}

function fetcher(string, date) {
    var result = [];
    var date = Math.floor(date / 1000000);
    var c;
    if (date <= 20070209) {
        c = 1;
    }
    if (date > 20070209 && date <= 20080424) {
        c = 2;
    }
    if (date > 20080424 && date <= 20091112) {
        c = 3;
    }
    if (date > 20091112 && date <= 20101004) {
        c = 4;
    }
    if (date > 20101004 && date <= 20110628) {
        c = 5;
    }
    if (date > 20110628 && date <= 20110720) {
        c = 6;
    }
    if (date > 20110720 && date <= 20110830) {
        c = 7;
    }
    if (date > 20110830 && date <= 20110918) {
        c = 8;
    }
    if (date > 20110918) {
        c = 9;
    }
    //try for correct date. If error try for the next range. If still error try previous range.
    try {
        result = patterns(c, string, date);
    } catch (e) {
        try {
            result = patterns(c + 1, string, date);
        } catch (e) {
            try {
                result = patterns(c - 1, string, date);
            } catch (e) {
                console.log("Unable to retrieve data of " + movieName + " (" + imdb_url + ") for" + date);
            }
        }
    }
    return result;
}

function patterns(num, string, date) {
    var result = [];
    switch (num) {
        case 1:
            //Ref url: http://web.archive.org/web/20070209064101/https://www.imdb.com/title/tt0120338/
            var essential = string.find('table').text();
            imdbhtml = string;
            var rating = /^(\d.+)\/10/gm;
            var numvotes = /\((.+) votes\)/gm;
            var match = rating.exec(essential);
            result.push(Number(match[1]));
            match = numvotes.exec(essential);
            match[1] = match[1].replace(/,/g, "");
            result.push(parseInt(match[1]));
            break;
        case 2:
            //Ref url: http://web.archive.org/web/20070816164703/http://www.imdb.com:80/title/tt0414993
            var essential = string.find('.rating').text();
            var rating = /^(\d.+)\/10/gm;
            var numvotes = /\((.+) votes\)/gm;
            var match = rating.exec(essential);
            result.push(Number(match[1]));
            match = numvotes.exec(essential);
            match[1] = match[1].replace(/,/g, "");
            result.push(parseInt(match[1]));
            break;
        case 3:
            // Ref url: http://web.archive.org/web/20091112015512/http://imdb.com:80/title/tt0414993/
            var rating = string.find('.meta b').text();
            rating = rating.substring(0, rating.length - 3);
            result.push(Number(rating));
            var numvotesText = string.find('.tn15more').text();
            var numvotes = /(.+) votes/gm;
            match = numvotes.exec(numvotesText);
            match[1] = match[1].replace(/,/g, "");
            result.push(parseInt(match[1]));
            break;
        case 4:
            // Ref url: http://web.archive.org/web/20101004181547/http://imdb.com:80/title/tt0414993/
            var rating = string.find('.starbar-meta b').text();
            rating = rating.substring(0, rating.length - 6);
            result.push(Number(rating));
            var numvotesText = string.find('.tn15more').text();
            var numvotes = /(.+) votes/gm;
            match = numvotes.exec(numvotesText);
            match[1] = match[1].replace(/,/g, "");
            result.push(parseInt(match[1]));
            break;
        case 5:
            // Ref url: http://web.archive.org/web/20110628113437/http://imdb.com:80/title/tt0414993/
            var rating = string.find('.rating-rating').text();
            rating = rating.substring(0, rating.length - 3);
            result.push(Number(rating));
            var numvotesText = string.find('[href="ratings"]').text();
            var numvotes = /(.+) votes/gm;
            match = numvotes.exec(numvotesText);
            match[1] = match[1].replace(/,/g, "");
            result.push(parseInt(match[1]));
            break;
        case 6:
            // Ref url: http://web.archive.org/web/20110720180900/http://www.imdb.com:80/title/tt0414993/
            var rating = string.find('[itemprop="ratingValue"]').text();
            result.push(Number(rating));
            var numvotesText = string.find('[href="ratings"]').text();
            var numvotes = /(.+) votes/gm;
            match = numvotes.exec(numvotesText);
            match[1] = match[1].replace(/,/g, "");
            result.push(parseInt(match[1]));
            break;
        case 7:
            //Ref url: http://web.archive.org/web/20110830045202/http://imdb.com:80/title/tt0414993/
            var rating = string.find('[itemprop="ratingValue"]').text();
            result.push(Number(rating));
            var numvotes = string.find('[itemprop="ratingCount"]').text();
            numvotes = numvotes.replace(/,/g, "");
            result.push(parseInt(numvotes));
            break;
        case 8:
            //Ref url: http://web.archive.org/web/20110918231720/http://imdb.com:80/title/tt0414993/
            var rating = string.find('.rating-rating .value').text();
            result.push(Number(rating));
            var numvotes = string.find('[itemprop="ratingCount"]').text();
            numvotes = numvotes.replace(/,/g, "");
            result.push(parseInt(numvotes));
            break;
        case 9:
            //Ref url: http://web.archive.org/web/20190113183003/https://www.imdb.com/title/tt0414993/
            var rating = string.find('[itemprop="ratingValue"]').text();
            result.push(Number(rating));
            var numvotes = string.find('[itemprop="ratingCount"]').text();
            numvotes = numvotes.replace(/,/g, "");
            result.push(parseInt(numvotes));
            break;
    }
    return result;
}

function downloadCSV() {
    if (dataArr[0] == "") {
        alert("Nothing to download!");
        return false;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date (en-UK),IMDb Rating,Number of Votes \r\n";
    dataArr.forEach(function(rowArray) {
        let row = rowArray[0].toLocaleDateString("en-UK") + "," + rowArray[1] + ",";
        var numvotes = /(\d+) Votes/g;
        var match = numvotes.exec(rowArray[2]);
        row += match[1];
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.getElementById("csv");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", movieName + ".csv");
    //document.body.appendChild(link); // Required for FF
}