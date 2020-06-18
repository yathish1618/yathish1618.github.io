//Two apis are getting called. First api is directly to tumblr. No change required here.
// Second api call is to fetch embed code. Here there's cors issue. Explore if other direct options are available.

var posts = [],
    limit = 10;
var i = 0,
    post_count, j = 0; //i is for getting all post details. j is for rendering 10 posts at a time

//First call. fetches 50 posts and total post count
$.getJSON("https://api.tumblr.com/v2/blog/yathish1618.tumblr.com/posts?limit=50&notes_info=true&api_key=usVunzXXi7KNgr7ar7IIggUj3X7ACPrSwr7gjgrnfkpt05kLD7", function(data) {
    post_count = data["response"]["total_posts"];
    $.each(data["response"]["posts"], function(key, val) {
        posts.push(val);
    });
    posts.sort((x, y) => y.note_count - x.note_count);
    i = 50;
    //call the same api iteratively until all posts are fetched
    getRemainingPosts();
});

function getRemainingPosts() {
    if (i < post_count) {
        $.getJSON("https://api.tumblr.com/v2/blog/yathish1618.tumblr.com/posts?limit=50&offset=" + i + "&notes_info=true&api_key=usVunzXXi7KNgr7ar7IIggUj3X7ACPrSwr7gjgrnfkpt05kLD7", function(data) {
            $.each(data["response"]["posts"], function(key, val) {
                posts.push(val);
            });
            posts.sort((x, y) => y.note_count - x.note_count);
            i += 50;
            getRemainingPosts();
        });
    } else {
        //Start rendering. This will be again another iterative loop
        renderPosts();
    }
}

function renderPosts() {
    $.getJSON("https://cors-anywhere.herokuapp.com/https://www.tumblr.com/oembed/1.0?url=https://yathish1618.tumblr.com/post/" + posts[j]["id_string"], function(data) {
        $("#posts").append(data["html"]);
        if (j < limit) {
            j++;
            renderPosts();
        } else {
            //All posts rendered. So show load more button
            document.getElementById("more").style.display = "table";
        }
    });
}

function loadMore() {
    // Hide load more button and show loading icon. Note that loading icon has negative z-index instead of putting it's display none.
    document.getElementById("more").style.display = "none";
    document.getElementById("loading").style.top = scrollY + screen.height / 2;
    limit += 10;
    j++;
    renderPosts();
}