1. Update xml files manually
2. The excel sheet for creating index is just for reference and calculations. Several mistakes in formatting were fixed in xml directly. So don't use excel file.
3. Don't worry about unused footnotes in footnotes.xml. Or look into it some time later.
4. While rendering the page after fetching xml, the footnotes are re-enumerated from 1 in the script. The actual references are hyperlinked properly. This re-enumeration is just for tidy display when only a single article is shown.
5. Be extra careful with name="#_ftnref" and href="_ftn" formats between footnotes.xml and articles.xml or schedules.xml. It could be confusing!
6. Appendices are just considered extra schedules.. so in the xml file they are named schedule13, schedule14 etc
7. To do - 
- See how to enable back button navigation (this will help in multiple ways like retaining scroll position). Italicise clause references in Schedules. 
- Everything is updated except the html formatting of appendices
- For text proofing Ctrl+F * based footnotes. May have missed some of those.
- Look into the reference formatting []. Some of the open brackets do not have corresponding closing brackets in my xml. Some of the titles themselves have references which have also been omitted.