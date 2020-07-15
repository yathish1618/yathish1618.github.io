	• Scripts
		○ Advanced Report. Put it in Program Files/Scripts folder and then double click. Also, read the vbs file. Just one more step required is to add a few lines into Scripts.ini file inside script folder (to initialise the script).
		○ RegExpReplace. This will ask if ~250 sample presets should be installed as well. Say yes. Once installed, you'll find Copy [from field] to [to field] which you may use to copy Comments into Custom 1 field. This is to basically copy Date modified.
	• Note - Comments, Custom 1 and Added - all these 3 columns should have same value. When Comments is copied to Added column, invalid date entries (misspellings etc) are automatically pointed out.
	• Create a playlist with all tracks in it. This is to create a sortable table (last tab) (Note: Autoplaylist won't get exported via Advanced Report, so manually create All Tracks playlist)
	• All playlists can be exported as M3U from Tools>Scripts>Export all Playlists
	• Go to File->Reports->Advanced Reports and choose settings as shown in screenshot below :
	Track mask: <Track#><|><Title><|><Stars><|><Rating><|><Length><|><Album><|><Genre><|><Artist><|><Composer><|><Year><|><Custom 1>
	Album mask: <Name> (<Artist>) <Genre> [<Year>]
	• 
	• Now copy images folder (only album art images). Stars have been modified by me. Retain them.
	Update Index.htm header (date and no. Of tracks etc)
	Split html into 5 parts. The 5th part is just a playlist - All tracks.
	• Note: No need to edit css/script
	• Find and replace "Custom 1" as "Date Added"
	• Remove the following phrases as those attributes are useless -
	alt="Image" 
	border="0"
	 style="width:100px;border:0px;"
