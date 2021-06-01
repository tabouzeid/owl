const axios = require("axios");
const cheerio = require("cheerio");


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
                    console.log(name);
                    chapterNumber = tmp;
                }
            }
        } 
    });
    return chapterNumber;
}


module.exports = {getLatestManganeloChapter};