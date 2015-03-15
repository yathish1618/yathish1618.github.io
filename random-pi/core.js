$(document).ready(function(){
		var curKey = 3; //variable to loop through array
		var best=0;
		var feedPi = ["3",".","1","4"];
		var checkPi = "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912983367336244065664308602139494639522473719070217986094370277053921717629317675238467481846766940513200056812714526356082778577134275778960917363717872146844090122495343014654958537105079227968925892354201995611212902196086403441815981362977477130996051870721134999999837297804995105973173281609631859502445945534690830264252230825334468503526193118817101000313783875288658753320838142061717766914730359825349042875546873115956286388235378759375195778185778053217122680661300192787661119590921642019893809525720106548586327886593615338182796823030195203530185296899577362259941389124972177528347913151557485724245415069595082953311686172785588907509838175463746493931925506040092770167113900984882401285836160356370766010471018194295559619894676783744944825537977472684710404753464620804668425906949129331367702898915210475216205696602405803815019351125338243003558764024749647326391419927260426992279678235478163600934172164121992458631503028618297455570674983850549458858692699569092721079750930295532116534498720275596023648066549911988183479775356636980742654252786255181841757467289097777279380008164706001614524919217321721477235014144197356854816136115735255213347574184946843852332390739414333454776241686251898356948556209921922218427255025425688767179049460165346680498862723279178608578438382796797668145410095388378636095068006422512520511739298489608412848862694560424196528502221066118630674427862203919494504712371378696095636437191728746776465757396241389086583264599581339047802759009946576407895126946839835259570982582262052248940772671947826848260147699090264013639443745530506820349625245174939965143142980919065925093722169646151570985838741059788595977297549893016175392846813826868386894277415599185592524595395943104997252468084598727364469584865383673622262609912460805124388439045124413654976278079771569143599770012961608";
		var checkPiArr = checkPi.split("");
		updateHighlight();//pre-highlight 3.14
		//capture input digit and check its value and score
		$("#pi").on('input',null, function(e)
			{					
				var text = $(this).val();
				var lastChar = text.slice(-1);
				feedPi.push(lastChar);
				curKey++;
				calcScore(curKey,feedPi,checkPiArr);
				if (guessBank==0) {this.disabled=true;$('.gameOver').fadeIn();
					if((feedPi.length-4)>localStorage.getItem(bestScore))
					{
						localStorage.setItem(bestScore,(feedPi.length-4));
						document.getElementById('bestScore').innerHTML="New best farthest reach: <strong>"+localStorage.getItem(bestScore)+"</strong> digits!";
					}
					else{
						document.getElementById('bestScore').innerHTML="Your farthest reach: <strong>"+localStorage.getItem(bestScore)+"</strong> digits!";
					}
				}
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

var score = 0;
var guessBank = 5;
var curScore= 0;
var curDeviation = 0;
var totalDeviation = 0;
var hits = 0;
var correctKeyArray = [[0,1],[1,2],[2,3],[3,4]];
var incorrectKeyArray = [];
function calcScore(curKey,feedPi,checkPiArr) {
	var checkVal = checkPiArr[curKey];
	var feedVal = feedPi[curKey];
	curScore = checkVal-feedVal;
	guessBank--;
	if (curScore==0) {
		hits++;  
		guessBank+=10;
		correctKeyArray.push([curKey,curKey+1]);
		updateHighlight();
	}
	else {
			if (curScore<0) {curScore = curScore*-1;}
			incorrectKeyArray.push([curKey,curKey+1]);
			updateHighlight();
	}
	curDeviation = (curScore/10)*100;
	curDeviation = Math.round(curDeviation*100)/100;
	totalDeviation = (totalDeviation+curDeviation)/2;
	totalDeviation = Math.round(totalDeviation*100)/100;
	score+=curScore;
	document.getElementById('showDeviation').innerHTML=totalDeviation+"%";
	document.getElementById('hitRate').innerHTML=hits;
	document.getElementById('guessCount').innerHTML=(feedPi.length-4);
	document.getElementById('guessBank').innerHTML=guessBank;
	return score;
}
//function to highlight correct digits in one color and incorrect digits in another color
function updateHighlight(){
	$('#pi').highlightTextarea('setOptions',{
							  ranges: [{
								color: '#FFFF00',
								ranges: correctKeyArray
							  },{
								color: '#FFFFFF',
								ranges: incorrectKeyArray
							  }]
							}
	);
}

function showInfo(divId){
	if(divId==1){
	$('.infoContent').toggle();}
	else{
	$('.infoContent').show();
	}
}

if(localStorage.getItem("best") == null) {
    var bestScore = localStorage.setItem("best", 0);
}else {
    var bestScore = localStorage.getItem("best");
}
