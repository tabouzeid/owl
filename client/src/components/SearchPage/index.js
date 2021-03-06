import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SeriesCard from "../SeriesCard";

function SearchPage() {
    const [seriesList, setSeriesList] = useState([]);
    const [siteList, setSiteList] = useState([]);
    const [searchString, setSearchStringState] = useState("");
    const [searchResults, setSearchResultsState] = useState([]);
    const [siteSelected, setSiteState] = useState();

    useEffect(() => {
        if(siteList.length && (!siteSelected)){
            setSiteState(siteList[0]);
        }
    }, [siteList, siteSelected])

    useEffect(() => {
        axios.get('/api/series')
            .then((resp) => {
                setSeriesList(resp.data);
            });
        axios.get('/api/site')
            .then((resp) => {
                setSiteList(resp.data);
            })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        search();
    };

    const handleSiteChange = (event) => {
        setSiteState(siteList[event.target.value]);
    }

    const handleSearchStringChange = (event) => {
        setSearchStringState(event.target.value);
    }

    const addSeries = (event) => {
        axios.post('/api/series', {
                seriesName: event.target.getAttribute('seriesname'),
                seriesSiteId: event.target.getAttribute('siteid'),
                seriesIdOnSite: event.target.getAttribute('seriesidonSite'),
                seriesImageUrl: event.target.getAttribute('seriesimageurl'),
            },
            {
                contentType: "application/json",
                dataType: "json",
            })
        .then((response) => {
            setSeriesList([...seriesList, response.data])
        });
    }

    /**
     * author: "Kazanami Shi<span style="color: #FF530D;font-weight: bold;">nog</span>i, Miwa Yoshiyuki"
     * id: "899"
     * id_encode: "the_new_gate"
     * image: "https://avt.mkklcdnv6.com/33/d/1-1583464999.jpg"
     * lastchapter: "Chapter 60"
     * name: "The New Gate"
     * nameunsigned: "the_new_gate"
     * @param searchString
     */
    const search = () => {
        if(siteSelected){
            let searchUrl = siteSelected.searchUrlTemplate;
            axios.post(searchUrl, `searchword=${searchString}`)
                .then((response) => {
                    const results = [];
                    let jsonResult = response.data;
                    for (let i = 0; i < jsonResult.length; i++) {
                        jsonResult[i].name = jsonResult[i].name.toLowerCase().replace(/(<([^>]+)>)/gi, "");
                        jsonResult[i].name = jsonResult[i].name.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                        results.push({
                            seriesIdOnSite: jsonResult[i].id_encode,
                            seriesName: jsonResult[i].name,
                            seriesImageUrl: jsonResult[i].image,
                            // eslint-disable-next-line
                            seriesUrl: siteSelected.seriesUrlTemplate.replace('${seriesId}', jsonResult[i].id_encode),
                        });
                    }
                    setSearchResultsState(results);
                }).catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col d-flex justify-content-center align-items-center mt-3 mb-5">
                        <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
                            <select className="form-control mr-sm-2" id="search_site" onChange={handleSiteChange} name='site_selected'>
                                {siteList.map((siteInList, index) => <option key={siteInList.id} value={index}>{siteInList.siteName}</option>)}
                            </select>
                            <input type="search" className="form-control mr-sm-2" id="search_field" name="search_field" value={searchString} onChange={handleSearchStringChange} placeholder="Search" aria-label="Search"/>
                            <button className="btn btn-success my-2 my-sm-0" id="search_button" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="card-group">
                            {searchResults.map((searchItem, index) => (
                                <SeriesCard 
                                    key={index} 
                                    isSearching={true} 
                                    site={siteSelected} 
                                    series={searchItem} 
                                    seriesList={seriesList} 
                                    buttonText="Add" 
                                    buttonColor="primary" 
                                    buttonClickAction={addSeries}/>)
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
