library(ggplot2)
library(reshape2) #This is to use melt
library(dplyr) #This is to use pipe separator %>%
library(svglite) #This is to write to svg file
rawData = read.csv("C:/Users/Yathish/Desktop/test.csv",header = TRUE, row.names = 1)
for(i in 1:nrow(rawData)){
  data = rawData[1:i,]
  m1 <- structure(as.numeric(unlist(data)), .Dim = c(nrow(data),ncol(data)), .Dimnames =list(row.names(data),colnames(data)))
  df <- melt(m1)
  yrs=unique(df[,1])
  #First and last years MUST be included and keep 5 more labels in between
  lbls=unique(round(seq(min(yrs),max(yrs),(max(yrs)-min(yrs))/5)))
  #Figure out the top 10 countries of latest year
  dfTop= df%>% 
    filter(Var1 == row.names(data)[length(row.names(data))]) %>%
    top_n(.,10,value)
  #Only keep the data of above top 10 countries
  df=df[which(df$Var2 %in% dfTop$Var2),]
  ggplot(df, aes(x=Var1, y=value, col=Var2))+
    geom_line()+ 
    #Add a point to only the last data point (latest year)
    geom_point(data = df%>% 
                 filter(Var1 == row.names(data)[length(row.names(data))]))+ 
    #Add labels Country names at the end of each line
    geom_text(data=df%>% 
                filter(Var1 == row.names(data)[length(row.names(data))]) %>%
                top_n(.,10,value),
              aes(x = Var1 + 1.03, label=Var2), vjust="inward",hjust="inward")+
    #opts(title=max(yrs), plot.title=theme_text(size=40, vjust=1.5))+
    theme(legend.position="none")+
    #This is to overlay latest year as title inside the plot for png
    #ggtitle(max(yrs))+theme(plot.title = element_text(size=40,face = "bold",hjust=0.5,margin = margin(t = 10, b = -40)))+
    #comprss function converts numbers into Million, Billion format for Y axis
    scale_y_continuous("GDP (current USD)", labels=comprss)+
    scale_x_continuous("Year",labels=lbls,breaks = lbls)
  #Save the plots as both png and svg
  ggsave(file=paste("C:/xampp/htdocs/yathish1618.github.io/econometrics/world-gdp-trends/images/",i,".png"), plot=last_plot(),units = "in",width = 900/72, height=600/72)
  #ggsave(file=paste("C:/xampp/htdocs/yathish1618.github.io/econometrics/world-gdp-trends/images/",i,".svg"), plot=last_plot(),units = "in",width = 900/72, height=600/72)
}

comprss <- function(tx) {
  div <- findInterval(as.numeric(gsub("\\,", "", tx)), 
                      c(0, 1e3, 1e6, 1e9, 1e12) )
  paste(round( as.numeric(gsub("\\,","",tx))/10^(3*(div-1)), 3), 
        c("","K","M","B","T")[div] )
}