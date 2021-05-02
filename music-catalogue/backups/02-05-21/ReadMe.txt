	• Scripts
		○ Advanced Report. Put it in Program Files/Scripts folder and then double click. Also, read the vbs file. Just one more step required is to add a few lines into Scripts.ini file inside script folder (to initialise the script).
		○ RegExpReplace. This will ask if ~250 sample presets should be installed as well. Say yes. Once installed, you'll find Copy [from field] to [to field] which you may use to copy Comments into Custom 1 field. This is to basically copy Date modified.
	
	• Prelims - Added should be updated into Custom 1. Play count should be updated to Custom 2. Add all tracks to All Tracks playlist manually because automated playlists don't get exported into the report.
	
	• All playlists can be exported as M3U from Tools>Scripts>Export all Playlists
	• Go to File->Reports->Advanced Reports and choose settings as shown in screenshot below :Track mask: <Track#><|><Title><|><Stars><|><Length><|><Album><|><Genre><|><Artist><|><Composer><|><Year><|><Custom 2><|><Custom 1><|><Lyrics>
	Album mask: <Name> (<Artist>) <Genre> [<Year>]
	• 
	• Now copy images folder (only album art images). Stars have been modified by me. Retain them.Update Index.htm header (date and no. Of tracks etc)Split html into 5 parts. The 5th part is just a playlist - All tracks.
	• Note: No need to edit css/script
	• Find and replace "Custom 1" as "Date Added"
	• Find and replace "Custom 2" as "Play Count"
	• Remove the following phrases as those attributes are useless (Removing alt and border crap is somehow necessary for tablesorter parser to count number of stars correctly) -alt="Image" border="0" style="width:100px;border:0px;"

	To do - check why some pages are having to be downloaded twice in the script. Lines 106-150 seems to have unncessary duplication (ex. loading albums.html and processing lyrics etc happening twice). Make sure to check different use cases - possible loading of page can be default or #Album or #album_123 (same pattern for Playlist or Artist i.e., play123 or artist123). Problem is scroll has to be at the right position after processing in all cases.
