//Handle tabs.
function activateTab(tab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    if (tab == "indexButton") tab1 = "Contents";
    if (tab == "artistsButton") tab1 = "Artists";
    if (tab == "albumsButton") tab1 = "Albums";
    if (tab == "playlistsButton") tab1 = "Playlists";
    if (tab == "tracklistButton") tab1 = "Tracklist";
    if (tab == "archivesButton") tab1 = "Archives";
    if (tab == "aboutButton") tab1 = "About";
    document.getElementById(tab1).style.display = "block";
    document.getElementById(tab).className += " active";
    //$('table').trigger('filterReset').trigger('sortReset'); //reset tablesorter search filters and sort
}

$(document).ready(function() {

    //Loading symbol
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading"); },
        ajaxStop: function() { $body.removeClass("loading"); }
    });
    //Load index by default
    $("#Contents").load("contents.html");
    //load all html file assets
    loadhtml();

    document.getElementById("indexButton").click();

    handleURL();

    //whenever url is changed reload content accordingly
    $(window).on('hashchange', function(e) {
        handleURL();
    });

    //change url if a button is clicked
    $('button[data-href]').click(function() {
        var s = window.location.href;
        var n = s.search(/(#.*$)/g);
        if (n > -1) s = s.slice(0, n); //sanitise url
        var href = $(this).attr('data-href');

        //Here we'll simply change the url. handleURL function then actually updates body. It is triggered through above $(window).on('hashchange'...
        if (href.indexOf('artists') >= 0) {
            window.location.href = s + "#Artists";
        }
        if (href.indexOf('playlists') >= 0) {
            window.location.href = s + "#Playlists";
        }
        if (href.indexOf('albums') >= 0) {
            window.location.href = s + "#Albums";
        }
        if (href.indexOf('tracklist') >= 0) {
            window.location.href = s + "#Tracklist";
        }
        if (href.indexOf('archives') >= 0) {
            window.location.href = s + "#Archives";
        }
        if (href.indexOf('about') >= 0) {
            window.location.href = s + "#About";
        }
        if (href.indexOf('contents') >= 0) {
            window.location.href = s + "#Index";
        }
    })
});

function handleURL() {

    //This first part is to directly handle when URL has one of the tabs (first time load)
    var s = window.location.href;
    if (s.indexOf('#Tracklist') >= 0) {
        if ($.trim($("#Tracklist").html()) == '') document.getElementById('tracklistButton').click();
    }
    if (s.indexOf('#Albums') >= 0) {
        if ($.trim($("#Albums").html()) == '') document.getElementById('albumsButton').click();
    }
    if (s.indexOf('#Artists') >= 0) {
        if ($.trim($("#Artists").html()) == '') document.getElementById('artistsButton').click();
    }
    if (s.indexOf('#Archives') >= 0) {
        if ($.trim($("#Archives").html()) == '') document.getElementById('archivesButton').click();
    }
    if (s.indexOf('#About') >= 0) {
        if ($.trim($("#About").html()) == '') document.getElementById('aboutButton').click();
    }
    if (s.indexOf('#Playlists') >= 0) {
        if ($.trim($("#Playlists").html()) == '') document.getElementById('playlistsButton').click();
    }
    //This second part is to handle cases where hyperlinks are between the tabs
    var href = (/(#.*$)/g).exec(s);
    if (href) {
        href = href[0];
        console.log(href);
        //var href = $(this).attr('href');
        if (href.indexOf('#artist_') >= 0) {
            activateTab('artistsButton');
            if ($.trim($("#Artists").html()) == '') $("#Artists").load("artists.html", function() {
                $(document).scrollTop($(href).offset().top);
            });
            else {
                $(document).scrollTop($(href).offset().top);
            }
        }
        if (href.indexOf('#album_') >= 0) {
            activateTab('albumsButton');
            if ($.trim($("#Albums").html()) == '') $("#Albums").load("albums.html", function() {
                //Lyrics column - wrap lyrics inside a span that is hidden by css.
                $('#Albums td:last-child').each(function() {
                    var lyrics = this.innerHTML;
                    $(this).html('<a onclick="showLyrics(this);">View</a><span>' + lyrics + '</span>');
                });
                $('.album_wrapper .cover').each(function() {
                    $(this).insertBefore($(this).prev('.tracks'));
                });
                $(document).scrollTop($(href).offset().top);
            });
            else {
                $(document).scrollTop($(href).offset().top);
            }
        }
        if (href.indexOf('#play_') >= 0) {
            activateTab('playlistsButton');
            if ($.trim($("#Playlists").html()) == '') $("#Playlists").load("playlists.html", function() { //Lyrics column - wrap lyrics inside a span that is hidden by css.
                $('#Playlists td:last-child').each(function() {
                    var lyrics = this.innerHTML;
                    $(this).html('<a onclick="showLyrics(this);">View</a><span>' + lyrics + '</span>');
                });

                $("#Playlists table").addClass("tablesorter");
                //add thead tags for tablesorter to recognise table headers.
                $('#Playlists table').each(function() {
                    $(this).prepend('<thead></thead>');
                    $(this).find('thead').append($(this).find("tr:eq(0)"));
                });
                callTablesorter();
                $(document).scrollTop($(href).offset().top);
            });
            else {
                $(document).scrollTop($(href).offset().top);
            }
        }
    }
}

function callTablesorter() {
    $('table')
        .tablesorter({
            theme: 'blue',
            widthFixed: true,
            textExtraction: {
                //count number of stars and return numeric rating
                2: function(node, table, cellIndex) {
                    var a = $(node)[0].getElementsByTagName('img');
                    var j = 0;
                    for (i = 0; i < 5; i++) {
                        if (a[i].src.search("images/star.png") > 0) j++;
                    }
                    return j;
                }
            },
            widgets: ['filter'],
            dateFormat: "ddmmyyyy",
            widgetOptions: {
                filter_liveSearch: true,
                //filter_searchDelay : 1000 //milliseconds
            }
        })
}

function loadhtml() {
    $("#Tracklist").load("tracklist.html", function() {
        //Lyrics column - wrap lyrics inside a span that is hidden by css.
        $('#Tracklist td:last-child').each(function() {
            var lyrics = this.innerHTML;
            $(this).html('<a onclick="showLyrics(this);">View</a><span>' + lyrics + '</span>');
        });
        $("#Tracklist table").addClass("tablesorter");
        $('<thead></thead>').prependTo('#Tracklist table').append($('#Tracklist tr:first'));
        callTablesorter();
    });
    $("#Albums").load("albums.html", function() {
        //Lyrics column - wrap lyrics inside a span that is hidden by css.
        $('#Albums td:last-child').each(function() {
            var lyrics = this.innerHTML;
            $(this).html('<a onclick="showLyrics(this);">View</a><span>' + lyrics + '</span>');
        });
        $('.album_wrapper .cover').each(function() {
            //This is to reorder cover div before tracks div inside each album wrapper
            $(this).insertBefore($(this).prev('.tracks'));
        });
    });
    $("#Artists").load("artists.html");
    $("#Archives").load("archives.html");
    $("#About").load("about.html");
    $("#Playlists").load("playlists.html", function() {
        //Lyrics column - wrap lyrics inside a span that is hidden by css.
        $('#Playlists td:last-child').each(function() {
            var lyrics = this.innerHTML;
            $(this).html('<a onclick="showLyrics(this);">View</a><span>' + lyrics + '</span>');
        });
        $("#Playlists table").addClass("tablesorter");
        //add thead tags for tablesorter to recognise table headers.
        $('#Playlists table').each(function() {
            $(this).prepend('<thead></thead>');
            $(this).find('thead').append($(this).find("tr:eq(0)"));
        });
        callTablesorter();
    });
}

function showLyrics(elmnt) {
    document.getElementById("lyrics-modal").style.display = "block";
    document.querySelector(".lyrics-content p").innerHTML = elmnt.nextSibling.innerHTML;
    var lyricsmodal = document.getElementById("lyrics-modal");

    var lyricsspan = document.getElementsByClassName("lyrics-close")[0];
    lyricsspan.onclick = function() {
        lyricsmodal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == lyricsmodal) {
            lyricsmodal.style.display = "none";
        }
    }
}