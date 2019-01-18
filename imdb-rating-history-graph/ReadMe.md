This work is not in anyway affiliated with IMDb.

The page is meant for research purpose. Be patient with the loading time.

The basic idea behind the graph is to pull out archived pages of IMDb titles (at 6 month intervals) from the waybackmachine (https://archive.org/help/wayback_api.php) and plot them into a line chart. To scrape data from waybackmachine, Whateverorigin API is used. Sometimes data loading might freeze. In such cases you may try loading the page again.

Things to do (Minor):
- Update date array. Define it so that it wouldn't need periodic manual updation.
- Switch from waybackmachine api to cdx. (ex. http://web.archive.org/cdx/search/cdx?url=https://www.imdb.com/title/tt0360486/&output=json). This will reduce ajax call load
- Styling - chart size should be ~80% of viewport.
- abort pending ajax queries for search suggestions if a new key has already been pressed

Things to do (Major):
- Multiline chart implementation
- Search functionality to be expanded to include non-titles
- Look for alternatives to Whateverorigin to speed things up (ex. simple jquery plugin - http://www.ajax-cross-origin.com/)
