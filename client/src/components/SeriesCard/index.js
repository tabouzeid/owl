import React from "react";
import {Col, Card, Button} from "react-bootstrap";
import axios from "axios";
import "./style.css";

function SeriesCard(props) {
    // eslint-disable-next-line
    const seriesUrl = props.site.seriesUrlTemplate.replace('${seriesId}', props.series.seriesIdOnSite);
    const seriesName = props.series.seriesName;
    const imageUrl = props.series.seriesImageUrl;

    const markSeriesViewed = () => {
        if(props.series.id){
            axios.put(`/api/series/${props.series.id}/mark_last_checked`);
        }
    }

    const isAlreadyAdded = () => {
        if(props.isSearching){
            return props.seriesList.find((series) => {
                return series.seriesIdOnSite === props.series.seriesIdOnSite}
            ) !== undefined;
        }
        return false;
    }

    return (
        <Col className="mb-3">
            <Card className="text-center" style={{marginTop:'10px', width: '18rem'}}>
                <Card.Body>
                    <Card.Title className="trunc" style={{textTransform: "capitalize"}}>{seriesName}</Card.Title>
                    <a href={seriesUrl} rel="noopener noreferrer" target="_blank">
                        <Card.Img src={imageUrl} onClick={markSeriesViewed} className="mr-3 rounded img-thumbnail" style={{width:'auto', height:'250px'}}/>
                    </a>
                </Card.Body>
                <Card.Footer>
                    <Button variant={props.buttonColor}
                            disabled={isAlreadyAdded()}
                            onClick={props.buttonClickAction}
                            seriesname={seriesName}
                            siteid={props.site.id}
                            seriesimageurl={imageUrl}
                            seriesidonsite={props.series.seriesIdOnSite}
                            seriesid={props.series.id}> {props.buttonText}
                    </Button>
                </Card.Footer>
            </Card>
        </Col>
    );
}

export default SeriesCard;