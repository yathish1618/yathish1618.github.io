var rawData, uniqueTitles, titlesCurrent, x, y, svg, H = 10000,
    i = 0,
    years;
var W = $(window).width() * 0.8;
var data = d3.csv("1996-2018utf8.csv").then(function(data) {
    //Format data as numbers
    rawData = data;
    years = d3.map(rawData, function(d) { return d["Top.250.Year"]; }).keys();
    $(".nextSearch").attr('data-content',years[1]);
    $(".prevSearch").attr('data-content',years[years.length-1]);
    data.forEach(function(d) {
        d.Position = +d.Position;
        d["IMDb.Rating"] = +d["IMDb.Rating"]; //parse as number
    });
    //Begin with the year 1996
    data = data.filter(function(d) { return d["Top.250.Year"] == 1996; });
    data.sort(function(x, y) {
        return d3.descending(x.Position, y.Position);
    })
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = W - margin.left - margin.right,
        height = H - margin.top - margin.bottom;

    // set the ranges
    y = d3.scaleBand()
        .range([height, 0])
        .padding(0.5);

    x = d3.scaleLinear()
        .range([0, width]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    //x.domain([0, d3.max(data, function(d) { return d["IMDb.Rating"]; })])
    x.domain([0, 10])
    y.domain(data.map(function(d) { return d["Position"]; }));

    // append the rectangles for the bar chart
    svg.selectAll(null)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("id", function(d) { return d["Const"]; })
        .attr("width", function(d) { return x(d["IMDb.Rating"]); })
        .attr("y", function(d) { return y(d["Position"]); })
        .attr("height", y.bandwidth())
        .attr("style", function(d) { return randomColor(); })
        .attr("rating",function(d) { return d["IMDb.Rating"]; })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click",handleClick);

    //append movie label on top of bars
    svg.selectAll(null)
        .data(data)
        .enter()
        .append("a")
        .attr("xlink:href", function(d) { return "https://www.imdb.com/title/"+d["Const"]; })
        .attr("target","_blank")
        .append("text")
        .attr("class", "label")
        .attr("x", (function(d) { return x(d["IMDb.Rating"]) - 2; }))
        .attr("y", function(d) { return y(d["Position"]); })
        .attr("id", function(d) { return d["Const"] + "label"; })
        .attr("dy", ".75em")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .on("mouseover", showPoster)
        .on("mouseout", hidePoster)
        .text(function(d) { return d["Title"]; });

    //append dummy bars for all remaining unique titles
    uniqueTitles = d3.map(rawData, function(d) { return d["Const"]; }).keys();
    titlesCurrent = d3.map(data, function(d) { return d["Const"]; }).keys();
    var pendingTitles = uniqueTitles.filter(x => !titlesCurrent.includes(x));
    // append the rectangles for the bar chart
    var pendingTitlesIndices = [];
    for(var j=0; j<pendingTitles.length;j++){
      for(var i = 0; i < rawData.length; i++) {
         if(rawData[i].Const === pendingTitles[j]) {
           pendingTitlesIndices.push(i);break;
         }
      }
    }
    var pendingTitlesData = pendingTitlesIndices.map((item) => rawData[item]);
    svg.selectAll(null)
        .data(pendingTitlesData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("id", function(d) { return d["Const"]; })
        .attr("width", x(8)) //pretend dummy rating is 8 - animation looks smoother
        .attr("y", H) //place at the bottom (on x-axis)
        .attr("height", 0)
        .attr("style", function(d) { return randomColor(); })
        .attr("rating",function(d) { return d["IMDb.Rating"]; })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click",handleClick);

    //append movie label on top of bars
    svg.selectAll(null)
        .data(pendingTitlesData)
        .enter()
        .append("a")
        .attr("xlink:href", function(d) { return "https://www.imdb.com/title/"+d["Const"]; })
        .attr("target","_blank")
        .append("text")
        .attr("class", "label")
        .attr("x", x(8))
        .attr("y", H)
        .attr("id", function(d) { return d["Const"] + "label"; })
        .attr("dy", ".75em")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .on("mouseover", showPoster)
        .on("mouseout", hidePoster)
        .text(function(d) { return d["Title"]; }); //get the name of the movie

    //one text element to show rating on hover or click
    svg.append("text")
        .attr("id", "rating-label")
        .attr("x", x(8))
        .attr("y", H)
        .attr("dy", ".75em")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // add the x Axis at top as well
    svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisTop(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});

function updateChart(year) {
    data = rawData.filter(function(d) { return d["Top.250.Year"] == year; });
    titlesCurrent = d3.map(data, function(d) { return d["Const"]; }).keys();
    // append the rectangles for the bar chart
    titlesCurrent.forEach(function(f) {
        var w = x(data.filter(function(d) { return d["Const"] == f; })[0]["IMDb.Rating"]);
        var p = y(data.filter(function(d) { return d["Const"] == f; })[0]["Position"]);
        d3.select("#" + f).transition() // another transition
            .delay(200)
            .duration(1500)
            .attr("width", w)
            .attr("y", p)
            .attr("height", y.bandwidth());
        d3.select("#" + f + "label").transition() // another transition
            .delay(200)
            .duration(1500)
            .attr("x", w - 2)
            .attr("y", p);
    });
    var pendingTitles = uniqueTitles.filter(x => !titlesCurrent.includes(x));
    pendingTitles.forEach(function(f) {
        d3.select("#" + f).transition() // another transition
            .delay(200)
            .duration(1500)
            .attr("width", x(8))
            .attr("y", H)
            .attr("height", 0);
        d3.select("#" + f + "label").transition() // another transition
            .delay(200)
            .duration(1500)
            .attr("x", x(8))
            .attr("y", H);
    });
}

function randomColor() {
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    return "fill:rgb(" + getRandomInt(256) + "," + getRandomInt(256) + "," + getRandomInt(256) + ");fill-opacity:0.5;";
}

function searchPrev() {
  i = (i==0) ? years.length-1 : i-1; 
  updateChart(years[i]);
  document.getElementById('currentSearch').innerText = "IMDb Top 250 in " + years[i];
  j = (i==0) ? years.length-1 : i-1;
  k = (i==years.length-1) ? 0 : i+1;
    $(".prevSearch").attr('data-content',years[j]);
    $(".nextSearch").attr('data-content',years[k]);
    scrollToActive();
}

function searchNext() {
  i = (i == years.length-1) ? 0 : i+1;
        updateChart(years[i]);
    document.getElementById('currentSearch').innerText = "IMDb Top 250 in " + years[i];
    j = (i==years.length-1) ? 0 : i+1;
    k = (i==0) ? years.length-1 : i-1;
    $(".nextSearch").attr('data-content',years[j]);
    $(".prevSearch").attr('data-content',years[k]);
    scrollToActive();
}
function scrollToActive(){
  if($(".active").length==0) return false;
  var activeId = $(".active").attr("id");
  data = rawData.filter(function(d) { return d["Top.250.Year"] == years[i]; });
  data = data.filter(function(d) { return d["Const"] == activeId; });
  if(data.length==0) {pos = H;}
  else {pos = y(data[0]["Position"]);}
  setTimeout(function(){$('html, body').animate({
    scrollTop: pos
}, 1500);}, 200)
}
function handleMouseOver(){
  var r = d3.select(this).attr("rating");
  var w = d3.select(this).attr("width");
  var h = d3.select(this).attr("y");
  d3.select(this).style("fill-opacity","1");
  d3.select("#rating-label").attr("x",parseFloat(w)+2).attr("y",h).text(r);
    
}
function handleMouseOut(){
  //$('#flyout').html("");
  d3.select(this).style("fill-opacity","0.5");
  d3.select("#rating-label").text("");
}
function handleClick(){
  d3.selectAll('rect').attr("class","");
  d3.select(this).attr("class", "active");;
}
function showPoster(){
    var e = this;
    var id = e.id.substring(0,e.id.length-5)
    name = 'imdb$' + id;
    window[name] = function(data) {
        if (data['d'] === undefined) return false; //no data returned by imdb
        searchArr = data['d'];
        poster = searchArr[0]["i"][0]; //link to hi-res poster
        poster = poster.replace("._V1_.jpg", "._V1_UX182_CR0,0,182,268_AL__QL50.jpg"); //to get lower resolution poster
        imdb_url = 'https://www.imdb.com/title/' + searchArr[0]["id"] + '/';
        $('#flyout').html("<a target='_blank'><img></a>");
        $('#flyout img').attr("src", poster);
        $('#flyout a').attr("href",imdb_url);
    }
    var IMDbAjax = $.ajax({
        dataType: "jsonp",
        url: 'https://v2.sg.media-imdb.com/suggests/titles/t/' + id.toLowerCase()+ '.json',
        success: function(data) {}
    });
    var x = event.clientX,
        y = event.clientY ;
    var flyout = document.getElementById('flyout');
    $('#flyout').addClass("flyout");
    flyout.style.top = (y +10) + 'px';
    flyout.style.left = (x +10) + 'px';
}
function hidePoster(){
        $('#flyout').html(""); 
}
//arrow keys functionality
$(document).keydown(
    function(e)
    {    
        if (e.keyCode == 39) {      
            searchNext();
        }
        if (e.keyCode == 37) {      
            searchPrev();
        }
    }
);