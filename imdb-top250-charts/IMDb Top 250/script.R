df<-data.frame()
data<-data.frame()
file_names <- dir() #where you have your files
for (f in file_names) {
  k = read.csv(paste(f))
  k$`Top.250.Year`=substr(f,14,17)
   data <- rbind(data,k)
}
#Titles that appear in all years
s = unique(data[,2])
v = c()
for(a in s){
  p=1
  for(i in 1996:2018){
    t = data[which(data$Top.250.Year==i),]
    if(length(which(t[,2]==a))==0) {
      p=0
      break
    }
  }
  if(p==1) v <- c(v, a)
}
