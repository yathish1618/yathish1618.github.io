Notes for updating imdb-ratings.csv
Export all lists and run R script
Remove Original.Title column which is extra

Notes for updating goodreads-ratings.csv
Main problem is getting the links for book cover images. In index.html page there is commented out code. Uncomment it. It's the goodreads widget that fetches and displays latest 200 books I've read. The custom JS script below that will parse all that crap and give a nice csv with book id and required image code. Run this code in console. In the csv do vlookup and update the last column with this id. There's one more column at the last for year in this csv too.
Filter all "read" books and make sure all these have the last column year filled. 
For some books date read is not getting exported in the goodreads csv. Vlook up date read from existing csv where I've manually updated it for missing books (only 5-6 books)

Notes for updating music
Nothing to do Yay. Can consider exporting album art at 150x150 or 200x200 resolution. Make sure that doesn't affect music-catalogue page.