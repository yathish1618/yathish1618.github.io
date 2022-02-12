// global variable to maintain latest values and store full source data
var year = 2022;
var media = 1,
    imdbData, movies, grData, books, gamesData, games, sort=1;
var musicData = [];
var music;

function getIMDbPosterLink(titleId) {
    name = 'imdb$' + titleId; //have to define a custom function in the format imdbtt1687247
    window[name] = function(data) {
        if (data['d'] === undefined) return false; //no data returned by imdb
        poster = data['d'][0]["i"][0].replace("._V1_.jpg", "._V1_UX182_CR0,0,182,268_AL__QL50.jpg"); //.replace part is to get low-res link.
        try {
            // document.getElementById(data['d'][0]["id"]).setAttribute("data-src", poster);
            img_doms = document.getElementsByName(data['d'][0]["id"])
            for(let i = 0;i < img_doms.length; i++)
            {
                img_doms[i].setAttribute("data-src", poster);
            }
        } catch (err) {
            //Ajax returned too late. Drop down option changed meanwhile. So the above div can't be found. No worries.
        }
        document.dispatchEvent(new CustomEvent('scroll')); //trigger scroll event - to load images on load for first time
    }
    IMDbAjax = $.ajax({
        dataType: "jsonp",
        url: 'https://v2.sg.media-imdb.com/suggests/titles/' + titleId.slice(0, 1).toLowerCase() + '/' + titleId + '.json',
        success: function(data) {}
    });
}

Papa.parse("data/imdb-ratings.csv", {
    download: true,
    complete: function(results) {
        imdbData = results.data.slice(1); //remove header
        updateMovieGrid(year,sort);
    }
});

Papa.parse("data/goodreads_library_export.csv", {
    download: true,
    complete: function(results) {
        grData = results.data.slice(1); //remove header
        //updateBooksGrid(year); //no need to load bookgrid by default
    }
});

var s = $.get("../music-catalogue/albums.html", function(html_string) {
        	parseMusicHTML(s);
        }, 'html'); //Generate music data

function updateMedia(x) {
    if (x.value == media) return false;
    media = x.value;
    updateGrid(media);
}

function updateYear(x) {
    if (x.value == year) return false;
    year = x.value;
    updateGrid(media);
}

function updateSort(x) {
    if (x.value == sort) return false;
    sort = x.value;
    updateGrid(media);
}

function updateGrid(media){
    if (media == 1) updateMovieGrid(year,sort);
    if (media == 2) updateBooksGrid(year,sort);
    // sorting is not applicable for music grid
    if (media == 3) updateMusicGrid(year);
    if (media == 4) updateDocusGrid(year,sort);
    if (media == 5) updateGamesGrid(year,sort);
    if (media == 6) updateTVGrid(year,sort);
}


function updateMovieGrid(yr,srt) {
    if (document.getElementById("container").innerHTML != "" && yr.value == year) return false; //This is to avoid reloading same grid if year hasn't changed. Exception for first time load.
    if (isNaN(yr)) yr = yr.value; //if coming from drop down selection (it'll be a string hence NaN)
    year = yr;
    movies = filter(imdbData, 19, yr.toString());
    movies = filter(movies, 17, "Movies");
    updateIMDBGrid(yr,srt,movies)
}
function updateGamesGrid(yr,srt) {
    if (document.getElementById("container").innerHTML != "" && yr.value == year) return false; //This is to avoid reloading same grid if year hasn't changed. Exception for first time load.
    if (isNaN(yr)) yr = yr.value; //if coming from drop down selection (it'll be a string hence NaN)
    year = yr;
    games = filter(imdbData, 19, yr.toString());
    games = filter(games, 17, "Games");
    updateIMDBGrid(yr,srt,games)
}
function updateDocusGrid(yr,srt) {
    if (document.getElementById("container").innerHTML != "" && yr.value == year) return false; //This is to avoid reloading same grid if year hasn't changed. Exception for first time load.
    if (isNaN(yr)) yr = yr.value; //if coming from drop down selection (it'll be a string hence NaN)
    year = yr;
    docus = filter(imdbData, 19, yr.toString());
    docus = filter(docus, 17, "Documentaries");
    updateIMDBGrid(yr,srt,docus)
}
function updateTVGrid(yr,srt) {
    if (document.getElementById("container").innerHTML != "" && yr.value == year) return false; //This is to avoid reloading same grid if year hasn't changed. Exception for first time load.
    if (isNaN(yr)) yr = yr.value; //if coming from drop down selection (it'll be a string hence NaN)
    year = yr;
    tv = filter(imdbData, 19, yr.toString());
    tv = filter(tv, 17, "TV Series");
    updateIMDBGrid(yr,srt,tv)
}

function updateIMDBGrid(yr,srt,records) {
    if(srt==1){
        records.sort(function(a, b) { //to sort in descending order of date in 2nd columnm
            var d2 = a[18].split('-');
            d2 = new Date(d2[0], d2[1] - 1, d2[2]); //this crap is to modify 2nd column as date
            var d1 = b[18].split('-');
            d1 = new Date(d1[0], d1[1] - 1, d1[2]);
            return d1 - d2;
        });
    }
    if(srt==2){
        records.sort(function(a, b) { //to sort in descending order of rating in 1st columnm
            return b[15] - a[15];
        });
    }
    if(srt==3){
        records.sort(function(a, b) { //to sort in descending order of global rating in 6th columnm
            return b[8] - a[8];
        });
    }
    var recordsGrid = "";
    for (var i = 0; i < records.length; i++) {
        recordsGrid += "<div class='imagebox'><img class='lazy' data-src='' id='" + records[i][0] + "'  name='" + records[i][0] + "' width='182' height='268'><a href='" + records[i][6] + "' target='_blank'><div class='caption'><table><tr><td>" + records[i][5] + "<br>My Rating:" + records[i][15] + "<br>IMDb Rating:" + records[i][8] + "<br>Rewatch #"+records[i][1]+"</td></tr></table></div></a></div>"; //table is to get nice center alignment
        getIMDbPosterLink(records[i][0]);
    }
    document.getElementById("container").innerHTML = recordsGrid;
    initiateLazyLoad();
}

function updateBooksGrid(yr,srt) {
    if (document.getElementById("container").innerHTML != "" && yr.value == year) return false; //This is to avoid reloading same grid if year hasn't changed. Exception for first time load.
    if (isNaN(yr)) yr = yr.value; //if coming from drop down selection (it'll be a string hence NaN)
    year = yr;
    books = filter(grData, 18, "read");
    books = filter(books, 32, yr.toString());
    if(srt==1){
        books.sort(function(a, b) { //to sort in descending order of date in 2nd columnm
            var d2 = a[14].split('-');
            d2 = new Date(d2[2], d2[1] - 1, d2[0]); //this crap is to modify 2nd column as date
            var d1 = b[14].split('-');
            d1 = new Date(d1[2], d1[1] - 1, d1[0]);
            return d1 - d2;
        });
    }
    if(srt==2){
        books.sort(function(a, b) { //to sort in descending order of date in 2nd columnm
            return b[7] - a[7];
        });
    }
    if(srt==3){
        books.sort(function(a, b) { //to sort in descending order of date in 2nd columnm
            return b[8] - a[8];
        });
    }
    var bookGrid = "";
    for (var i = 0; i < books.length; i++) {
        bookGrid += "<div class='imagebox'><img class='lazy' data-src='https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/" + books[i][31] + "/" + books[i][0] + "._SX182_.jpg' id='" + books[i][0] + "' width='182' height='268'><a href='https://www.goodreads.com/book/show/" + books[i][0] + "' target='_blank'><div class='caption'><table><tr><td>" + books[i][1] + "<br>My Rating:" + books[i][7] + "<br>Goodreads:" + books[i][8] + "</td></tr></table></div></a></div>"; //table is to get nice center alignment
    }
    document.getElementById("container").innerHTML = bookGrid;
    initiateLazyLoad();
    document.dispatchEvent(new CustomEvent('scroll')); //trigger scroll event - to load images on load for first time
}

function updateMusicGrid(yr) {
	if (document.getElementById("container").innerHTML != "" && yr.value == year) return false; //This is to avoid reloading same grid if year hasn't changed. Exception for first time load.
    if (isNaN(yr)) yr = yr.value; //if coming from drop down selection (it'll be a string hence NaN)
    year = yr;
    music = filter(musicData, 4, yr.toString());
    music.sort(function(a, b) { 
        return b[3] - a[3];
    });
    var musicGrid = "";
    for (var i = 1; i < music.length; i++) {
        musicGrid += "<div class='imagebox musbox'><img class='lazy' data-src='../music-catalogue/images/" + music[i][2] + ".jpg' id='" + music[i][2] + "' width='100' height='100'><a href='../music-catalogue/#album_" + music[i][2] + "' target='_blank'><div class='caption'><table><tr><td>" + music[i][0] + "<br>" + music[i][1] + "</td></tr></table></div></a></div>"; //table is to get nice center alignment
    }
    document.getElementById("container").innerHTML = musicGrid;
    initiateLazyLoad();
    document.dispatchEvent(new CustomEvent('scroll')); //trigger scroll event - to load images on load for first time

}
function parseDate(input) {
  var parts = input.split('-');
  return new Date(parts[2], parts[1]-1, parts[0]); // Note: months are 0-based
}

function parseMusicHTML(s){
	d = new DOMParser().parseFromString(s.responseText, "text/html");
            d = d.getElementsByClassName('album_wrapper');
            var c = [];
            $.each(d, function(index, value) {
                var t = value.getElementsByTagName('a'); //will help in album name, artists name, album id
                var s = t[0].id.slice(6,t[0].id.length); //extract album id
                var e = $(value.getElementsByTagName('tr')).find("td:eq(10)"); //last column is date added
                var f = []; //small for loop below to find max date added amongst all songs of the album
                $.each(e, function(i, v) {
                    f.push(parseDate(v.innerText.slice(0, 10)));
                });
                f = new Date(Math.max(...f));
                c.push([t[1].innerText, t[2].innerText, s, f, f.getFullYear().toString()]);
                musicData = c;
            });
            return true;
}

// filter 2d arrays - to check against a column (either include or exclude matches)
// negative = true means matches should be excluded
function filter(array, key, value, negative = false) {
    if(value=="0") { //special case of All Time where no filtering to be done
        array.pop(); //removes last row which is blank
        return array; //removes first row which is just header
    }
    var i, j, hash = [],
        item;
    if(negative === true){
        for (i = 0, j = array.length; i < j; i++) {
            item = array[i];
            if (typeof item[key] !== "undefined" && item[key] !== value) {
                hash.push(item);
            }
        }
    }
    else{
        for (i = 0, j = array.length; i < j; i++) {
            item = array[i];
            if (typeof item[key] !== "undefined" && item[key] === value) {
                hash.push(item);
            }
        }
    }
    return hash;
}

// lazy loading images
function initiateLazyLoad() {
    var lazyloadImages = document.querySelectorAll("img.lazy");
    var lazyloadThrottleTimeout;

    function lazyload() {
        if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(function() {
            var scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function(img) {
                try{
                //if (img.offsetTop < (window.innerHeight + scrollTop)) { 
                if (img.offsetParent.offsetTop < (window.innerHeight + scrollTop)) { //had to add offsetParent for current page only. It's not there in the original.
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
            } catch(err){
                // don't know what went wrong but pretty sure it doesn't matter.
            }
            });
            if (lazyloadImages.length == 0) {
                document.removeEventListener("scroll", lazyload);
                window.removeEventListener("resize", lazyload);
                window.removeEventListener("orientationChange", lazyload);
            }
        }, 20);
    }

    //document.dispatchEvent(new CustomEvent('scroll')); //to intialise lazy load. commenting it out here because this is done via getIMDbPosterLink function for this custom page
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
};