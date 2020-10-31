const baseurljs = "https://cors-anywhere.herokuapp.com/https://manganelo.com/";
const siteInfoMap = {};
const currentSeriesMap = {};

$(document).ready(() => {
    $("#search_button").click((event) => {
        event.preventDefault();
        let searchString = $("#search_field").val();
        search(searchString);
    });

    $.ajax({
        type: 'GET',
        url: '/api/site',
        contentType: "application/json",
        dataType: "json",
        success: (jsonResult) => {
            const siteSelector = $('#search_site');
            siteSelector.empty();
            for(let site of jsonResult) {
                siteInfoMap[site.id] = site;
                let s = $('<option>');
                s.attr('data-id', site.id);
                s.text(site.siteName);
                siteSelector.append(s);
            }
        },
    });

    $.ajax({
        type: 'GET',
        url: '/api/series',
        contentType: "application/json",
        dataType: "json",
        success: (jsonResult) => {
            for(let series of jsonResult) {
                currentSeriesMap[series.seriesSiteId + '__' + series.seriesIdOnSite] = series;
            }
        },
    });
});

function handleAddSeries() {
    let seriesInfo = {
        id: $(this).attr('data-id'),
        name: $(this).attr('data-name'),
        image: $(this).attr('data-img'),
    }
    addSeries(seriesInfo);
}

function addSeries(seriesInfo) {
    $.ajax({
        contentType: "application/json",
        dataType: "json",
        url: '/api/series',
        type: 'POST',
        data: JSON.stringify({
            seriesName: seriesInfo.name,
            seriesSiteId: 1,
            seriesIdOnSite: seriesInfo.id,
            seriesImageUrl: seriesInfo.image,
        }),
    });
}

function search(searchString) {
    $.ajax({
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: baseurljs + 'getstorysearchjson',
        type: 'POST',
        data: "searchword=" + searchString,
        dataType: "json",
        success: displaySearchResults
    });
}

function displaySearchResults(jsonResult) {
    const searchResults = $('#search-results');
    searchResults.empty();
    for (let i = 0; i < jsonResult.length; i++) {
        // author: "Kazanami Shi<span style="color: #FF530D;font-weight: bold;">nog</span>i, Miwa Yoshiyuki"
        // id: "899"
        // id_encode: "the_new_gate"
        // image: "https://avt.mkklcdnv6.com/33/d/1-1583464999.jpg"
        // lastchapter: "Chapter 60"
        // name: "The New Gate"
        // nameunsigned: "the_new_gate"
        jsonResult[i].name = jsonResult[i].name.replace('<span style="color: #FF530D;font-weight: bold;">', '');
        jsonResult[i].name = jsonResult[i].name.replace('</span>', '');
        searchResults.append(parseResponse(jsonResult[i]));
    }
    $(".btn-primary").click(handleAddSeries);
}

function parseResponse(jsonResult){
    let buttonText = 'Add';
    let isDisabled = '';
    let seriesSite = $('#search_site option:selected').attr('data-id');
    let id = jsonResult.id_encode;
    let key = seriesSite+'__'+id;
    if(currentSeriesMap[key]){
        buttonText = 'Added';
        isDisabled = 'disabled';
    }
    return `
        <div class="col-3">
            <div class="card text-center" style="width: 18rem; border: none;">
              <div class="card-body">
                <h5 class="card-title trunc" style="text-transform: capitalize;">${jsonResult.name}</h5>
                <img src="${jsonResult.image}" class="mr-3 rounded img-thumbnail card-img" style="width: 200px; height: 300px" alt="Series Image">
                <button type="button" ${isDisabled} data-id="${jsonResult.id_encode}" data-img="${jsonResult.image}" data-name="${jsonResult.name}" class="btn btn-primary mt-2 series">${buttonText}</a>
              </div>
            </div>
        </div>
    `;
}
