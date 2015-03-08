<?php
session_start();
$temp='1';
$temp1='2';
echo $temp-$temp1;
$pi = !isset($_REQUEST['pi'])?123:$_REQUEST['pi'];
echo $pi;
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>Randomness</title>
	<script type="text/javascript"></script>
	<script language="javascript" type="text/javascript" src="jquery.js" ></script>
	<script language="javascript" type="text/javascript" src="core.js" ></script>	
	<style>
	textarea {
    background-color: #000;
    border: 1px solid #000;
    color: #00ff00;
    padding: 8px;
    font-family: courier new;
}
</style>
</head>

<body>
	<form action="<?=$_SERVER['PHP_SELF']?>">
		<fieldset align="center">
			<legend>Please Enter Your Random Values Here:</legend>
			<textarea value ="pi" id="pi" name="pi" rows="10" cols="58">3.14</textarea>
			<!--<textarea value ="pi" id="pi" name="pi" rows="10" cols="58" onkeypress='return event.charCode >= 48 && event.charCode <= 57'>3.14</textarea>-->
			<br/><br/>
			Average Error in your guess: <input type="text" name="schowScore" id="showScore" value="100%" disabled></input>
			<br/><br/>
			Number of correct guesses/Total guesses: <input type="text" name="hitRate" id="hitRate" value="0" disabled>
			<br/><br/>
			<input type="submit" value="Visualise my guess with Huge Data!">
		</fieldset>
		<a id="pi"></a>
	</form>
</body>

</html>