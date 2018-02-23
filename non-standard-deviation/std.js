// http://jsfiddle.net/hiddenloop/TPeJt/

var array         = [2, 3, 4, 6, 2, 5, 7, 2, 4, 5, 99];
var within_std_of = 3;

outputResult = function(str) {
  var content = $('#results').html();
  $('#results').html(content + str);
}

average = function(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}
    
withinStd = function(mean, val, stdev) {
   var low = mean-(stdev*x.deviation);
   var hi = mean+(stdev*x.deviation);
   return (val > low) && (val < hi);
}
  
outputResult("Set = [" + array.concat(',') + "]<br/><br/>");

var x = average(array);
outputResult(
    "mean      = " + x.mean + "<br />" +
    "deviation = " + x.deviation + "<br />" +
    "variance  = " + x.variance + "<br /><br />"
);
    
for(i=0; i<array.length; i++) {
  outputResult (array[i] + " inside " + within_std_of + "std? <strong>" + withinStd(x.mean, array[i],within_std_of) + "</strong><br/>");
}