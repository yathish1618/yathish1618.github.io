//Handle tabs 
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
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

    document.getElementById("indexButton").click();

    handleURL();
    //Navigate to appropriate tab for hyperlinks
    $("body").on('click', 'a', function(event) {
        handleURL();
    });
    //Load the html content on opening for first time
    $('button[data-href]').click(function() {
        var s = window.location.href;
        var n = s.search(/(#.*$)/g);
        	if(n>-1) s = s.slice(0,n); //sanitise url
		var href = $(this).attr('data-href');

        //Here we'll simply change the url. handleURL function then actually updates body.
        if (href.indexOf('artists') >= 0) {
        	window.location.href=s+"#Artists";
        }
        if (href.indexOf('playlists') >= 0) {
        	window.location.href=s+"#Playlists";
        }
        if (href.indexOf('albums') >= 0) {
            window.location.href=s+"#Albums";
        }
        if (href.indexOf('tracklist') >= 0) {
            window.location.href=s+"#Tracklist";
        }
        if (href.indexOf('contents') >= 0) {
        	window.location.href=s;
        	//document.getElementById('indexButton').click();
        }
        handleURL();
    })
});

function handleURL() {
    var s = window.location.href;
    if (s.indexOf('#Tracklist') >= 0) {
        if ($.trim($("#Tracklist").html()) == '') $("#Tracklist").load("tracklist.html", function() {
            $("#Tracklist table").addClass("tablesorter");
            $('<thead></thead>').prependTo('#Tracklist table').append($('#Tracklist tr:first'));
            callTablesorter();
        });
        	document.getElementById('tracklistButton').click();
    }
    if (s.indexOf('#Albums') >= 0) {
        if ($.trim($("#Albums").html()) == '') $("#Albums").load("albums.html", function() {
            $('.album_wrapper .cover').each(function() {
                //This is to reord cover div before tracks div inside each album wrapper
                $(this).insertBefore($(this).prev('.tracks'));
            });
        });
        	document.getElementById('albumsButton').click();
    }
    if (s.indexOf('#Artists') >= 0) {
        if ($.trim($("#Artists").html()) == '') $("#Artists").load("artists.html");
        document.getElementById('artistsButton').click();

    }
    if (s.indexOf('#Playlists') >= 0) {

        if ($.trim($("#Playlists").html()) == '') {
            $("#Playlists").load("playlists.html", function() {
            $("#Playlists table").addClass("tablesorter");
            //add thead tags for tablesorter to recognise table headers.
            $('#Playlists table').each(function() {
                $(this).prepend('<thead></thead>');
                $(this).find('thead').append($(this).find("tr:eq(0)"));
            });
            callTablesorter();
        });}
		document.getElementById('playlistsButton').click();
    }
    var s = window.location.href;
        // var n = s.search(/(#.*$)/g);
        var href = (/(#.*$)/g).exec(s)[0];
        //var href = $(this).attr('href');
        if (href.indexOf('#artist_') >= 0) {
            //openCity(event, 'Artists');
            document.getElementById("artistsButton").click();
            if ($.trim($("#Artists").html()) == '') $("#Artists").load("artists.html", function() {
                $(document).scrollTop($(href).offset().top);
            });
            else {
                $(document).scrollTop($(href).offset().top);
            }
        }
        if (href.indexOf('#album_') >= 0) {
            //openCity(event, 'Albums');
            document.getElementById("albumsButton").click();
            if ($.trim($("#Albums").html()) == '') $("#Albums").load("albums.html", function() {
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
            //openCity(event, 'Albums');
            document.getElementById("playlistsButton").click();
            if ($.trim($("#Playlists").html()) == '') $("#Playlists").load("playlists.html", function() {
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
//I have just picked up this code from a stackoverflow answer
function callTablesorter() {
    var ts = $.tablesorter,
        sorting = false,
        searching = false;

    $('table')
        .tablesorter({
            theme: 'blue',
            widthFixed: true,
            widgets: ['filter'],
            dateFormat: "ddmmyyyy"
        })
        .on('sortBegin filterEnd', function(e, filters) {
            if (!(sorting || searching)) {
                var table = this,
                    c = table.config,
                    filters = ts.getFilters(table),
                    $sibs = $('.tablesorter').not(c.$table);
                if (!sorting) {
                    sorting = true;
                    $sibs.trigger('sorton', [c.sortList, function() {
                        setTimeout(function() {
                            sorting = false;
                        }, 500);
                    }]);
                }
                if (!searching) {
                    $sibs.each(function() {
                        if (this.hasInitialized) {
                            ts.setFilters(this, filters, true);
                        }
                    });
                    setTimeout(function() {
                        searching = false;
                    }, 500);
                }
            }
        });
}