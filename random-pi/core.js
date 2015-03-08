$(document).ready(function(){
		//current position counter for array check
		var curKey = 3;
		
		
		//Live capture input numbers
		var feedPi = ["3",".","1","4"];
		
	var checkPi = "3.1412386151312243834893568935935814123861513122438348935689359358141238615131224383489356893593581412386151312243834893568935935814123861513122438348935689359358";
	var checkPiArr = checkPi.split("");
		$("#pi").live('input', function(e)
			{					
				var text = $(this).val();
				console.log(text);
				var lastChar = text.slice(-1);
				feedPi.push(lastChar);
				console.log(feedPi);
				curKey++;
				console.log(calcScore(curKey,feedPi,checkPiArr));
			}
		)
		//Prevent backspace, delete, copy paste etc
		$('#pi').keydown('input', function (e) {
			// Allow: backspace, delete, tab, escape, enter and .
			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
				 // Allow: Ctrl+A
				(e.keyCode == 65 && e.ctrlKey === true) || 
				 // Allow: home, end, left, right
				(e.keyCode >= 35 && e.keyCode <= 39)) {
					 // let it happen, don't do anything
					 //return;
					 // Disallow above all
					 return false;
			}
			// Ensure that it is a number and stop the keypress
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
		})
	}
);
//Capturing vaue of pi on keydown rather than live. If live is slow/crashing use this
/*$(document).keydown('input', function(e) {  
		if($("textarea#pi").val() !== "") {
			var text = $("textarea#pi").val();
			console.log(text);
			var lastChar = text.slice(-1);
			feedPi.push(lastChar);
			console.log(feedPi);
		}
	});*/
	var score = 0;
	var curScore= 0;
	var curError = 0;
	var totalError = 0;
	var hits = 0;
function calcScore(curKey,feedPi,checkPiArr) {
	var checkVal = checkPiArr[curKey];
	var feedVal = feedPi[curKey];
	curScore = checkVal-feedVal;
	if (curScore==0) {hits++}
	if (curScore<0) {curScore = curScore*-1;}
	curError = (curScore/10)*100;
	totalError = (totalError+curError)/2;
	score+=curScore;
	document.getElementById('showScore').value=totalError+"%";
	document.getElementById('hitRate').value=hits+"/"+(feedPi.length-4);
	return score;

	// do a bunch of other stuff that isn't relevant
}