var index;
var searchArr = []; //contains results of search suggestion list from IMDb search ajax
var arr = []; //Just a list of title suggestions stringified - to populate in autocomplete suggestion list
var IMDbAjax;

function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        //Disable submit button
        document.querySelectorAll('input[type=submit]')[0].disabled = true;
        document.querySelectorAll('input[type=submit]')[0].classList.add("disabledSubmit");
        var a, b, i, val = this.value;
        var node = this;
        val = val.replace(/\s/g, '_'); //replace space with underscore
        val = val.replace(/\(|\)|\,/g, ''); //replace parantheses or commas with nothing - that's what IMDb does
                    // if (IMDbAjax) IMDbAjax.abort(); //abort any previous pending requests;

        // IMDb response needs a function to be defined of the format imdb$foo for searching foo
        // Below code defines a global function of the pattern imdb$foo even as the user types a search keyword
        // To avoid global scope pollution see this answer: https://stackoverflow.com/a/22880416/4401622
        // going ahead with this for now
        name = 'imdb$' + val;
        window[name] = function(data) {
            if(data['d']===undefined) return false; //no data returned by imdb
            searchArr = data['d'];
            arr = [];
            data['d'].forEach(function(entry) { arr.push(entry['l'] + ' (' + entry['y'] + ')'); });
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; } currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            node.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                //if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                //b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i];
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' index='" + i + "' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    document.getElementById("myInput").value = this.getElementsByTagName("input")[0].value;
                    index = this.getElementsByTagName("input")[0].getAttribute('index');
                    document.querySelectorAll('input[type=submit]')[0].disabled = false;
                    document.querySelectorAll('input[type=submit]')[0].classList.remove("disabledSubmit");
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
                //}
            }
        }

        IMDbAjax = $.ajax({
            dataType: "jsonp",
            url: 'https://v2.sg.media-imdb.com/suggests/titles/' + val.slice(0, 1).toLowerCase() + '/' + val + '.json',
            success: function(data) {}
        });

    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}


/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"));