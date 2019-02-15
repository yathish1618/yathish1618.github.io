google.charts.load("visualization", "1", {
    packages: ["corechart"]
});
var code, dataStats, plotArray;
var movieName;
var poster;

function process() {
    $('#loadingInfo').html("Loading... ");
    code = searchArr[index]["id"];
    movieName = searchArr[index]["l"];
    imdb_url = 'https://www.imdb.com/title/' + code + '/';
    poster = searchArr[index]["i"][0]; //link to hi-res poster
    poster = poster.replace("._V1_.jpg", "._V1_UX182_CR0,0,182,268_AL__QL50.jpg"); //to get lower resolution poster
    $('#poster img').attr("src", poster);
    $('#poster a').attr("href", imdb_url);
    $('#chart_div').empty(); //remove existing chart, if any
    g = document.createElement('div');
    g.setAttribute("id", code);
    document.getElementById('chart_div').appendChild(g);
    window.imdb = {};
    imdb.rating = {};
    imdb.rating.run = function(data) {
        $('#loadingInfo').html("&nbsp;");
        if (data['resource'] === undefined) return false; //no data returned by imdb
        dataStats = data["resource"]["ratingsHistograms"];
        var aggrRat = data["resource"]["rating"];
        var aggrVotes = data["resource"]["ratingCount"];
        plotArray = [
            ['Group', 'Rating', 'No. of Votes'],
            ['Aggregate', aggrRat, aggrVotes],
            ['Males', dataStats["Males"]["aggregateRating"], dataStats["Males"]["totalRatings"]],
            ['Females', dataStats["Females"]["aggregateRating"], dataStats["Females"]["totalRatings"]],
            ['Aged <18', dataStats["Aged under 18"]["aggregateRating"], dataStats["Aged under 18"]["totalRatings"]],
            ['Aged 18-29', dataStats["Aged 18-29"]["aggregateRating"], dataStats["Aged 18-29"]["totalRatings"]],
            ['Aged 30-44', dataStats["Aged 30-44"]["aggregateRating"], dataStats["Aged 30-44"]["totalRatings"]],
            ['Aged 45+', dataStats["Aged 45+"]["aggregateRating"], dataStats["Aged 45+"]["totalRatings"]],
            ['US users', dataStats["US users"]["aggregateRating"], dataStats["US users"]["totalRatings"]],
            ['Non-US users', dataStats["Non-US users"]["aggregateRating"], dataStats["Non-US users"]["totalRatings"]]
        ];
        var data = google.visualization.arrayToDataTable(plotArray);
        var options = {
            pointSize: 5,
            legend: { position: 'top', alignment : 'center' },
            chartArea: {
                left: 50,
                top: 20,
                width: '80%',
                height: '300',
            },
            vAxes: {
              0: {
                title: "IMDb Rating"
              },
              1: {
                title: "Number of Votes"
              }
            },
            width: 600,
            height: 400,
            series: {
                0: {
                    type: "bars",
                    targetAxisIndex: 0
                },
                1: {
                    type: "line",
                    targetAxisIndex: 1
                }
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById("chart_div"));
        chart.draw(data, options);
    }
    IMDbAjax = $.ajax({
        dataType: "jsonp",
        url: 'https://p.media-imdb.com/static-content/documents/v1/title/' + code + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json',
        success: function(data) {}
    });
}

function downloadCSV() {
    if (plotArray[0] == "") {
        alert("Nothing to download!");
        return false;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    plotArray.forEach(function(rowArray){
       let row = rowArray.join(",");
       csvContent += row + "\r\n";
    }); 
    var encodedUri = encodeURI(csvContent);
    var link = document.getElementById("csv");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", movieName + ".csv");
    //document.body.appendChild(link); // Required for FF
}