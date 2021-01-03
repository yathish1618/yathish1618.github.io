# We have to append new entries to existing csv
# Update imdb rating and num votes of existing csv
# Have to manually update that. Because many movies were added in bulk whose date rated (year) has been fixed manually.
existing <- read.csv("..\\imdb-ratings.csv")

new <- read.csv("Movies I've Seen.csv")
new <- rbind(new,read.csv("Documentaries_Shorts.csv"))
new <- rbind(new,read.csv("TV Series.csv"))

new <- subset(new, select = names(existing)[c(1:13)])

latest_ratings <- subset(new,select = c(Const,IMDb.Rating,Num.Votes))
to_update <- subset(existing,select = -c(IMDb.Rating,Num.Votes))
to_update <- merge(to_update,latest_ratings,by = c("Const"))
to_insert <- subset(new,Const %in% setdiff(new$Const,to_update$Const))
to_insert$Date.Rated..Fixed. <- substr(to_insert$Date.Rated,1,4)
to_insert$Rewatch.No. <- 0
to_update <- rbind(to_update,to_insert)
# Reorder 2 columns - imdb rating and num votes
to_update <- to_update[,c(1,2,3,4,5,6,14,7,8,9,15,10,11,12,13)]
write.csv(to_update,"imdb-ratings.csv", row.names = F)

