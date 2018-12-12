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
	$("Artists").trigger('click');
			$("a").click(function(event) {
                var href = $(this).attr('href');
				if(href.indexOf('#artist_') >= 0){
					openCity(event, 'Artists');
					$(document.body).scrollTop($(href).offset().top);
				}
            });
			$("a").click(function(event) {
                var href = $(this).attr('href');
				if(href.indexOf('#album_') >= 0){
					openCity(event, 'Albums');
					$(document.body).scrollTop($(href).offset().top);
				}
            });
        });

