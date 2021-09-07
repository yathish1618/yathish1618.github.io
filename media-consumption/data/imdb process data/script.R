# Corrections csv has correct date watched and date rewatched
# Created (when it was added to list) is used for sorting - proxy for watch/rewatch date

movies <- read.csv("Movies I've Seen.csv", stringsAsFactors = F)
movies$mediaType <- "Movies"
docus <- read.csv("Documentaries_Shorts.csv", stringsAsFactors = F)
docus$mediaType <- "Documentaries"
tv <- read.csv("TV Series.csv", stringsAsFactors = F)
tv$mediaType <- "TV Series"
games <- read.csv("Games.csv", stringsAsFactors = F)
games$mediaType <- "Games"

all_firsts <- do.call("rbind",list(movies,docus,tv,games))
all_firsts$Rewatch.No. <- 0

re1 <- read.csv("Rewatches #1.csv", stringsAsFactors = F)
re1$Rewatch.No. <- 1
re2 <- read.csv("Rewatches #2.csv", stringsAsFactors = F)
re2$Rewatch.No. <- 2
re3 <- read.csv("Rewatches #3.csv", stringsAsFactors = F)
re3$Rewatch.No. <- 3

all_res <- do.call("rbind",list(re1,re2,re3))
mediatypelookup <- subset(all_firsts, select = c("Const","mediaType"))
all_res <- merge(all_res,mediatypelookup,by="Const",all.x = T)

fin <- do.call("rbind",list(all_firsts,all_res))
fin$Date.Watched <- substr(fin$Created,1,4)

corrections <- read.csv("corrections.csv", stringsAsFactors = F)
names(corrections)[names(corrections) == 'ï..Const'] <- 'Const'
# make sure date format is %y-%m-%d
if (nchar(unlist(strsplit(corrections$Created[1],"-"))[1])==2) {
  corrections$Created <- format(as.Date(corrections$Created,format="%d-%m-%Y"),"%Y-%m-%d")
}

fin <- merge(fin,corrections,by = c("Const","Rewatch.No."),all.x = TRUE)

#  explanation for next line in text below.
fin$Created.y[ is.na(fin$Created.y) ] <- fin$Created.x[ is.na(fin$Created.y) ]
names(fin)[names(fin) == 'Created.y'] <- 'Created'
fin$Date.Watched.y[ is.na(fin$Date.Watched.y) ] <- fin$Date.Watched.x[ is.na(fin$Date.Watched.y) ]
names(fin)[names(fin) == 'Date.Watched.y'] <- 'Date.Watched'

fin <- subset(fin, select = -c(Created.x, Date.Watched.x))

write.csv(fin,"imdb-ratings.csv", row.names = F)

