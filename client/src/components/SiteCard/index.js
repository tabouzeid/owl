import React, { useEffect, useState } from "react";
import { Card, CardDeck } from "react-bootstrap";
import SeriesCard from "../SeriesCard";
import axios from "axios";

function SiteCard(props) {
    const [seriesList, setSeriesList] = useState([]);
    const [unreadFlag, setUnreadFlag] = useState(true);

    const deleteSeries = (event) => {
        let seriesId = event.target.getAttribute('seriesid');
        if (seriesId) {
            axios.delete(`/api/series/${seriesId}`)
            .then((response) => {
                let tmp = [...seriesList];
                tmp.splice(tmp.findIndex(item => item.id == seriesId), 1);
                setSeriesList(tmp);
            });
        }
    }

    useEffect(() => {
        axios.get('/api/series/updates')
            .then((resp) => {
                setSeriesList(resp.data);
            })
    }, [])

    const unreadSelected = unreadFlag ? "active" : "";
    const allSelected = !unreadFlag ? "active" : "";

    return (
        <Card style={{ marginTop: "20px", padding: "0px", width: 'auto' }}>
            <Card.Header className="d-flex">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4">
                            {props.site.siteName}
                            {seriesList.length === 0 ? <div className="spinner-border spinner-border-sm text-primary ml-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : ""}
                        </div>
                        <div className="col-4">

                        </div>
                        <div className="btn-group btn-group-toggle col-4 float-right" data-toggle="buttons">
                            <label className={"btn btn-primary btn-sm "+unreadSelected}>
                                <input type="radio" name="options" id="option1" autoComplete="off" onClick={event => setUnreadFlag(true)} /> Unread
                            </label>
                            <label className={"btn btn-primary btn-sm "+allSelected}>
                                <input type="radio" name="options" id="option2" autoComplete="off" onClick={event => setUnreadFlag(false)} /> Read
                            </label>
                        </div>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="container">
                    <div className="row">
                        <CardDeck>
                            {seriesList
                                .filter((series) => {
                                    return series.seriesSiteId === props.site.id && series.hasUpdate === unreadFlag;
                                }
                                ).map((series) =>
                                    <SeriesCard key={series.id} series={series} site={props.site} buttonText="Remove" buttonColor="danger" buttonClickAction={deleteSeries} />
                                )
                            }
                        </CardDeck>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default SiteCard;