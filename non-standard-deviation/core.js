$(document).ready(function(){
		//capture input digit and check its value and score
		$("#pi").on('input',null, function(e)
			{					
				var text = $(this).val();
				var target = $("#goal").val();
				target = parseInt(target,10);
				var a = text.split(',').map(function(num) { return parseInt(num, 10); });
				console.log(a);
				var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
				var s = a.reduce(function(a, b) { return a + b; }, 0);
				r.mean = s/t;
				a.sort();
				if (t % 2 === 0) {r.median = (a[t / 2 - 1] + a[t / 2]) / 2;} else {r.median = a[(t - 1) / 2];}
				r.mode=getMode(a);
				for(m = r.mean, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
				r.deviation = Math.sqrt(s / t);
				for(m = r.mean, l = t, s = 0; l--; s += Math.pow(a[l] - target, 2));
				r.ndeviation = Math.sqrt(s / t);
				for(m = r.mean, l = t, s = 0; l--; s += (a[l] - target));
				r.meanDev = s/t;
				for(m = r.mean, l = t, s = 0; l--; s += Math.abs(a[l] - target));
				r.absDev = s/t;
				console.log(target);
				document.getElementById('mean').innerHTML=r.mean.toFixed(2);
				document.getElementById('median').innerHTML=r.median.toFixed(2);
				document.getElementById('mode').innerHTML=r.mode.toFixed(2);
				document.getElementById('meanDev').innerHTML=r.meanDev.toFixed(2);
				document.getElementById('absDev').innerHTML=r.absDev.toFixed(2);
				document.getElementById('stdDev').innerHTML=r.deviation.toFixed(2);
				document.getElementById('nstdDev').innerHTML=r.ndeviation.toFixed(2);
			}
		)
		/*$('#pi').keydown('input', function (e) {
			// Ensure that it is a number and stop the keypress
			if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode==188))) {
				e.preventDefault();
			}
		})*/
	}
);
function getMode(a) {
    var o = {}, mC = 0, mV, m;
    for (var i=0, iL=a.length; i<iL; i++) {
        if (a.hasOwnProperty(i)) {
            m = a[i];
            o.hasOwnProperty(m)? ++o[m] : o[m] = 1;
            if (o[m] > mC) mC = o[m], mV = m;
        }
    }
    return mV;
}
function calcScore(curKey,feedPi,checkPiArr) {
	
	return score;
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
