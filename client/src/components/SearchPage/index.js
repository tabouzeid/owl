import React, {useContext, useEffect, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import axios from 'axios';
import SeriesCard from "../SeriesCard";
import UserSeriesContext from "../../util/UserSeriesContext";

function SearchPage() {
    const {userData} = useContext(UserSeriesContext);
    const [seriesList, setSeriesList] = useState([]);
    const [searchString, setSearchStringState] = useState("");
    const [searchResults, setSearchResultsState] = useState([]);
    const [siteSelected, setSiteState] = useState();

    const siteList = userData.siteList;

    useEffect(() => {
        if(siteList.length && (!siteSelected)){
            setSiteState(siteList[0]);
        }
    }, [siteList, siteSelected])

    useEffect(() => {
        axios.get('/api/series')
            .then((resp) => {
                setSeriesList(resp.data);
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
                        jsonResult[i].name = jsonResult[i].name.toLowerCase().replace('<span style="color: #ff530d;font-weight: bold;">', '');
                        jsonResult[i].name = jsonResult[i].name.replace('</span>', '');
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
                        <Form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
                            <Form.Control as="select" id="search_site" onChange={handleSiteChange} name='site_selected' className="mr-sm-2">
                                {siteList.map((siteInList, index) => <option key={siteInList.id} value={index}>{siteInList.siteName}</option>)}
                            </Form.Control>
                            <Form.Control as={"input"} id="search_field" name="search_field" value={searchString} onChange={handleSearchStringChange} className="mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                            <Button variant={"success"} id="search_button" className="my-2 my-sm-0" type="submit">
                                Search
                            </Button>
                        </Form>
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
