google.charts.load('current', { 'packages': ['line', 'corechart'] });
var imdb_url;
var imdbhtml, i;
var movieYear;
var movieName;
var poster;
var fetchedDate = "";
var dataArr = [
    []
];

var dates = [20010101, 20010601, 20020101, 20020601, 20030101, 20030601, 20040101, 20040601, 20050101, 20050601, 20060101, 20060601, 20070101, 20070601, 20080101, 20080601, 20090101, 20090601, 20100101, 20100601, 20110101, 20110601, 20120101, 20120601, 20130101, 20130601, 20140101, 20140601, 20150101, 20150601, 20160101, 20160601, 20170101, 20170601, 20180101, 20180601, 20190101]; //array to be updated every 6 months
//IMDb founded in 1990 and Waybackmachine in 2001

function process() {
    $('#loadingInfo').text("Loading... ");
    imdb_url = 'https://www.imdb.com/title/' + searchArr[index]["id"] + '/';
    movieYear = searchArr[index]["y"];
    movieName = searchArr[index]["l"];
    poster = searchArr[index]["i"][0]; //link to hi-res poster
    poster = poster.replace("._V1_.jpg", "._V1_UX182_CR0,0,182,268_AL__QL50.jpg"); //to get lower resolution poster
    $('#poster img').attr("src",poster);
    i = dates.length - 1;
    $('#chart_div').empty(); //remove existing chart, if any
    //reset data array
    dataArr = [
        []
    ];
    callWayBackMachine(dates[i]);
}

function callWayBackMachine(timestamp) {
    $.ajax({
        dataType: "jsonp",
        url: 'https://archive.org/wayback/available?url=' + encodeURIComponent(imdb_url) + '&timestamp=' + timestamp,
        success: function(data) {
            var date = data["archived_snapshots"]["closest"]["timestamp"];
            var url = data["archived_snapshots"]["closest"]["url"];
            if (fetchedDate != date) { //avoid calls to same archived page
                getRatingData(url, date);
                fetchedDate = date;
            }
            if (i >= 0 && Math.floor(dates[i] / 10000) >= movieYear && Math.floor(date / 10000000000) >= movieYear) {
                i--;
                callWayBackMachine(dates[i]);
            } else {
                $('#loadingInfo').text("Done!");
            }
        }
    });
}

function getRatingData(url, date) {
    $.getJSON('https://whateverorigin.herokuapp.com/get?url=' + encodeURIComponent(url) + '&callback=?',
        function(data) {
            if($('#loadingInfo').text()=="Done!" || $('#loadingInfo').text()==""){
                $('#loadingInfo').text("");
            } else{
                $('#loadingInfo').text("Fetching data from " + Math.floor(date / 10000000000));
            }
            imdbhtml = $($.parseHTML(data.contents));
            results = fetcher(imdbhtml, date);
            if(results[0]>0 && results[1]>0){ //update data array only if both rating and number of votes are valid 
                var dt = new Date(Math.floor(date / 10000000000), Number(date.toString().substring(4, 6)) - 1);
                var rt = results[0];
                // var tt = Math.floor(date / 10000000000)+"-"+date.toString().substring(4, 6)+"<br><strong>"+rt+"</strong><br>"+results[1] + " Votes";
                var tt = "<strong>"+rt+"</strong><br>("+results[1] + " Votes)";
                if (dataArr[0] == "") { dataArr[0] = [dt, rt, tt]; } else { //js months start from 0! (y,m) given here
                    dataArr.push([dt, rt, tt]);
                }
            }
            var chartDiv = document.getElementById('chart_div');

            graphData = new google.visualization.DataTable();
            graphData.addColumn('date', 'Month');
            graphData.addColumn('number', "Rating");
            graphData.addColumn({ type: 'string', role: 'tooltip','p': {'html': true} });

            dataArr.sort((function(index) {
                return function(a, b) {
                    return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
                };
            })(0)); //Sort array by first column (index=0) i.e., by date; Else charts goes bollocks

            graphData.addRows(dataArr);
            var materialOptions = {
                tooltip: { trigger: 'focus', isHtml:true },
                focusTarget: "category",
                pointSize: 5,
                legend: { position: 'none' },
                chartArea:{
                    left:50,
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
        });
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
    try{
        result = patterns(c,string,date);
    } catch(e) {
        try{
            result = patterns(c+1,string,date);
        } catch (e) {
            console.log(date);
            result = patterns(c-1,string,date);
        }
    }
    return result;
}

function patterns(num,string,date){
    var result=[];
    switch(num) {
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

function downloadCSV(){
    if(dataArr[0]=="") {
        alert("Nothing to download!");
        return false;
    } 
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date (en-UK),IMDb Rating,Number of Votes \r\n";
    dataArr.forEach(function(rowArray){
       let row = rowArray[0].toLocaleDateString("en-UK")+","+rowArray[1]+",";
       var numvotes = /(\d+) Votes/g;
        var match = numvotes.exec(rowArray[2]);
        row+=match[1];
       csvContent += row + "\r\n";
    }); 
    var encodedUri = encodeURI(csvContent);
    var link = document.getElementById("csv");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", movieName+".csv");
    //document.body.appendChild(link); // Required for FF
}