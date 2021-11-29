const axios = require("axios");
const cheerio = require("cheerio");
const {DateTime} = require("luxon");


async function getLatestManganeloChapter(seriesUrl) {
    const seriesInfo =  await axios.get(seriesUrl,
        {
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            }
        }
    )
    let chapterNumber = -1;
    const $ = cheerio.load(seriesInfo.data);
    const chapterNames = $(".chapter-name");
    const regexpChapterNumber = /(ch[a-z])*\b\d+/ig;
    chapterNames.each((index, chapterName) => {
        let name = $(chapterName).text().trim().toLowerCase();
        let chapter = name.match(regexpChapterNumber);
        if (chapter){
            let chapterNum = chapter[0].split(' ');
            if(chapterNum) {
                let tmp = parseFloat(chapterNum[chapterNum.length-1]);
                if(tmp > chapterNumber) {
                    chapterNumber = tmp;
                }
            }
        } 
    });
    return chapterNumber;
}

async function getLastPublicationDate(seriesUrl)  {
    const seriesInfoOnSite =  await axios.get(seriesUrl,
        {
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            }
        }
    )
    const $ = cheerio.load(seriesInfoOnSite.data);
    let lastPublicationDate;
    const dates = $(".chapter-time");
    dates.each((index, date) => {
        let currDate = manganeloParser.parseDate($(date).text().trim())
        if(currDate > lastPublicationDate){
            lastPublicationDate = currDate;
        }
    });
    return lastPublicationDate;
}

function parseDate(dateString) {
    let result;
    if(dateString.endsWith(" ago")){
        let num = dateString.slice(0, dateString.indexOf(" "));
        if(dateString.endsWith(" hrs ago") || dateString.endsWith(" hours ago") || dateString.endsWith(" hour ago")){
            result =  DateTime.local().minus({hours: num});
        } else if(dateString.endsWith(" mins ago") || dateString.endsWith(" minutes ago")){
            result =  DateTime.local().minus({minutes: num});
        } else if(dateString.endsWith(" days ago") || dateString.endsWith(" day ago")){
            result =  DateTime.local().minus({days: num});
        } else {
            result =  DateTime.local();
        }
    }  else {
        result = DateTime.fromFormat(dateString, "MMM dd,yy");
    }

    return result;
}


module.exports = {
    getLatestManganeloChapter: getLatestManganeloChapter,
    getLastPublicationDate: getLastPublicationDate,
    parseDate: parseDate
};