$(document).ready(function () {
    if(navigator.userAgent.indexOf("Firefox") != -1){
        getSeriesForSiteId(2);
    } else {
        getSeriesForSiteId(1);
    }
});

const ongoing = {};
let numOfSeries = 0;
async function getSeriesForSiteId(siteId){
    const res = await runQuery(`/api/series/${siteId}`);
    processSeriesForSite(res);
}

async function getAllSeries(){
    const res = await runQuery(`/api/series/`);
    processSeriesForSite(res);
}

function getPageWithList(series) {
    let siteName = series.getSiteName();
    let url = series.getSeriesUrl();
    let filter = series.getDateClassSectionQuery();
    $.ajax({
        method: "GET",
        url: "https://cors-anywhere.herokuapp.com/"+url,
        authority: "manganelo.com",
        "accept-encoding": "gzip, deflate, br",
        referer: "https://manganelo.com/",
        origin: "199.229.249.155",
        complete: function () {
            if(--numOfSeries == 0){
                $("#"+siteName+"-spinner").remove();
            }
        },
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            path: "/manga/tower_of_god_manga",
        }
    }).then(function (response) {
        let dates = $(filter, $.parseHTML(response));
        let latestDate = series.getLastChecked();
        let releaseDate;
        let maxReleaseDate;
        for( let i = 0; i < dates.length; i++){
            releaseDate = parseDate(dates[i].textContent);//.startOf('day');
            if(maxReleaseDate == undefined || releaseDate.isAfter(maxReleaseDate)){
                maxReleaseDate = releaseDate;
            }
        }
        let isHidden = false;
        if (latestDate == undefined ||
            latestDate.isBefore(maxReleaseDate)){
            isHidden = true;
        }
        $(`#${series.getSiteName()}`).append(addSeriesIcon(series, isHidden));
        $(document).on("click", ".btn-danger", function () {
            let key = $(this).attr('data-id');
            let series = getSeries(key);
            series.deleteSeries();
        });

        $(document).on("click", ".img-thumbnail", function () {
            console.log("hello");
            let key = $(this).attr('data-id');
            let series = getSeries(key);
            series.markLastChecked();
        });
    });
}

function createCard(siteName) {
    let cardHtml =
        `<div class="card" style="margin-top: 20px padding:0px">
            <div class="card-header">
                <div class="container">
                    <div class="row">
                        <div class="col-6">
                            <span>${siteName}</span>
                            <div id="${siteName}-spinner" class="spinner-border spinner-border-sm text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div class="col-6 text-right">
                            <div class="btn-group btn-group-sm text-right" role="group" aria-label="Basic example">
                                <button type="button" data-filter="new" class="btn btn-secondary">New</button>
                                <button type="button" data-filter="all" class="btn btn-secondary">All</button>
                            </div>        
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="container">
                    <div class="row" id="${siteName}">
                
                    </div>
                </div>
            </div>
         </div>`;

    $("#page").append(cardHtml);
}

/////////////// Thumbnail View

async function processSeriesForSite(seriesList) {
    numOfSeries = seriesList.length;
    let siteName = seriesList[0]['SeriesSite.siteName'];
    createCard(siteName);
    for(let index = 0; index < seriesList.length; index++) {
        let series = new Series(seriesList[index]);
        addSeries(series.getSiteId(), series.getSeriesIdOnSite(), series);
        getPageWithList(series, )
    }

    $(`#${siteName}-spinner`).remove();
}

function addSeriesIcon(series, isHidden){
    let buttonText = 'Remove';
    let seriesName = series.getName();
    let seriesUrl = series.getSeriesUrl();
    let seriesImg = series.getSeriesImageUrl();
    let id = getCacheKey(series.getSiteId(), series.getSeriesIdOnSite());
    let collapse = '';
    if(isHidden){
        collapse = 'collapse'
    }
    return `
        <div class="col-3 ${collapse}">
            <div class="card text-center" style="width: 18rem; border: none;">
              <div class="card-body">
                <h5 class="card-title trunc" style="text-transform: capitalize;">${seriesName}</h5>
                <a href="${seriesUrl}" target="_blank">
                    <img src="${seriesImg}" data-id="${id}" class="mr-3 rounded img-thumbnail card-img" style="width: 200px; height: 300px" alt="Series Image">
                </a>
                <button type="button" data-id="${id}" class="btn btn-danger mt-2 series">${buttonText}</button>
              </div>
            </div>
        </div>
    `;
}

/////////////// Utility Methods

function parseDate(dateString){
    dateString = dateString.trimEnd();
    let result;
    if(dateString.endsWith(" ago")){
        let num = dateString.slice(0, dateString.indexOf(" "));
        if(dateString.endsWith(" secs ago") || dateString.endsWith(" seconds ago")){
            result = moment().subtract(num, "seconds");
        } else if(dateString.endsWith(" hrs ago") || dateString.endsWith(" hours ago") || dateString.endsWith(" hour ago")){
            result = moment().subtract(num, "hours");
        } else if(dateString.endsWith(" mins ago") || dateString.endsWith(" minutes ago")){
            result = moment().subtract(num, "minutes");
        } else if(dateString.endsWith(" days ago") || dateString.endsWith(" day ago")){
            result = moment().subtract(num, "days");
        } else {
            result = moment();
        }
    }  else {
        result = moment(dateString);
    }
    return result;
}


function runQuery(url) {
    return $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json",
        dataType: "json",
    });
}

/////////////// Caching

const addedSeries = {};

function addSeries(siteId, seriesId, series) {
    addedSeries[getCacheKey(siteId, seriesId)] = series;
}

function getSeries(siteId, seriesId){
    return getSeries(getCacheKey(seriesId, seriesId));
}

function getSeries(cacheKey){
    return addedSeries[cacheKey];
}

function getCacheKey(siteId, seriesId) {
    return `${siteId}-${seriesId}`;
}

/////////////// Data Structures

class Series {
    constructor(data) {
        this.id = data.id;
        this.seriesName = data.seriesName;
        this.description = data.description;
        this.seriesSiteId = data.seriesSiteId;
        this.seriesIdOnSite = data.seriesIdOnSite;
        this.seriesImageUrl = data.seriesImageUrl;
        this.lastChecked = data.lastChecked;
        this.lastChapterViewed = data.lastChapterViewed;
        this.siteName = data['SeriesSite.siteName'];
        this.siteUrl = data['SeriesSite.siteUrl'];
        this.searchUrlTemplate = data['SeriesSite.searchUrlTemplate'];
        this.seriesUrlTemplate = data['SeriesSite.seriesUrlTemplate'];
        this.dateClassSelectionQuery = data['SeriesSite.dateClassSelectionQuery']
        if(this.seriesUrlTemplate) {
            let seriesId = this.seriesIdOnSite;
            this.seriesUrl = eval('`'+this.seriesUrlTemplate+'`');
        }
        if(this.lastChecked) {
            this.lastChecked = moment(this.lastChecked);
        }
    }

    getSiteId() {
        return this.seriesSiteId;
    }

    getSiteName() {
        return this.siteName;
    }

    getSeriesIdOnSite() {
        return this.seriesIdOnSite;
    }

    getSeriesSite() {
        return this.siteUrl;
    }

    getSeriesUrl(){
        return this.seriesUrl;
    }

    getName() {
        return this.seriesName;
    }

    getDescription() {
        return this.description;
    }

    getSeriesImageUrl() {
        return this.seriesImageUrl;
    }

    getDateClassSectionQuery () {
        return this.dateClassSelectionQuery;
    }

    getLastChecked() {
        return this.lastChecked;
    }

    markLastChecked() {
        return $.ajax({
            type: 'PUT',
            url: `/api/series/${this.id}/mark_last_checked`,
            contentType: "application/json",
            dataType: "json",
        });
    }

    deleteSeries() {
        return $.ajax({
            type: 'DELETE',
            url: `/api/series`,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                id: this.id
            })
        });
    }

    getLastChapterViewed() {
        return this.lastChapterViewed;
    }
}
