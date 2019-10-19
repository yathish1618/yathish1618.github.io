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
                if (img.offsetTop < (window.innerHeight + scrollTop)) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
            });
            if (lazyloadImages.length == 0) {
                document.removeEventListener("scroll", lazyload);
                window.removeEventListener("resize", lazyload);
                window.removeEventListener("orientationChange", lazyload);
            }
        }, 20);
    }

    document.dispatchEvent(new CustomEvent('scroll')); //to intialise lazy load.
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
};

function getIMDbPosterLink(titleId) {
    name = 'imdb$' + titleId; //have to define a custom function in the format imdbtt1687247
    window[name] = function(data) {
        if (data['d'] === undefined) return false; //no data returned by imdb
        poster = data['d'][0]["i"][0].replace("._V1_.jpg", "._V1_UX182_CR0,0,182,268_AL__QL50.jpg"); //.replace part is to get low-res link.
        document.getElementById(data['d'][0]["id"]).setAttribute("data-src", poster);
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
        imdbData = results.data;
        movies = filter(imdbData, 13, "2019");
        movies.sort(function(a, b) { //to sort in descending order of date in 2nd columnm
            var d2 = a[2].split('-');
            d2 = new Date(d2[2], d2[1] - 1, d2[0]); //this crap is to modify 2nd column as date
            var d1 = b[2].split('-');
            d1 = new Date(d1[2], d1[1] - 1, d1[0]);
            return d1 - d2;
        });
        var movieGrid = "";
        for (var i = 1; i < movies.length; i++) {
            movieGrid += "<div><img class='lazy' data-src='' id='" + movies[i][0] + "' width='182' height='268'></div>";
            getIMDbPosterLink(movies[i][0]);
        }
        document.getElementById("container").innerHTML = movieGrid;
        initiateLazyLoad();
    }
});

function updateMovieGrid(year){
        movies = filter(imdbData, 13, year.value);
        movies.sort(function(a, b) { //to sort in descending order of date in 2nd columnm
            var d2 = a[2].split('-');
            d2 = new Date(d2[2], d2[1] - 1, d2[0]); //this crap is to modify 2nd column as date
            var d1 = b[2].split('-');
            d1 = new Date(d1[2], d1[1] - 1, d1[0]);
            return d1 - d2;
        });
        var movieGrid = "";
        for (var i = 1; i < movies.length; i++) {
            movieGrid += "<div><img class='lazy' data-src='' id='" + movies[i][0] + "' width='182' height='268'></div>";
            getIMDbPosterLink(movies[i][0]);
        }
        document.getElementById("container").innerHTML = movieGrid;
        initiateLazyLoad();
}
function filter(array, key, value) {
    var i, j, hash = [],
        item;

    for (i = 0, j = array.length; i < j; i++) {
        item = array[i];
        if (typeof item[key] !== "undefined" && item[key] === value) {
            hash.push(item);
        }
    }
    return hash;
}