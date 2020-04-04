This work is not in anyway affiliated with IMDb.

The page is meant for research purpose. Be patient with the loading time.

The basic idea behind the graph is to pull out archived pages of IMDb titles (at 1/3/6/12 month intervals) from the [waybackmachine](https://archive.org/web/) using their [API](https://archive.org/help/wayback_api.php) and plot them into a line chart. To scrape data from waybackmachine, [Whateverorigin API](https://www.whateverorigin.org/) is used as a proxy to pull cross-origin data. This is partly why the loading takes some time. 

Things to do (Minor):
- Styling - chart size should be ~80% of viewport.

Things to do (Major):
- Multiline chart implementation
- Search functionality to be expanded to include non-titles
- Look for alternatives to Whateverorigin to speed things up (ex. simple jquery plugin - http://www.ajax-cross-origin.com/ Update: this plugin is slower than whateverorigin) 