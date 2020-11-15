import React from "react";
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
            props.series.hasUpdate = false;
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
        <div className="col mb-3">
            <div className="card text-center" style={{marginTop:'10px', width: '18rem'}}>
                <div className="card-body">
                    <div className="card-title trunc" style={{textTransform: "capitalize"}}>{seriesName}</div>
                    <a href={seriesUrl} rel="noopener noreferrer" target="_blank">
                        <img src={imageUrl} onClick={markSeriesViewed} className="mr-3 rounded card-img img-thumbnail" style={{width:'auto', height:'250px'}}/>
                    </a>
                </div>
                <div className="card-footer">
                    <button type="button" className={"btn btn-" + props.buttonColor}
                            disabled={isAlreadyAdded()}
                            onClick={props.buttonClickAction}
                            seriesname={seriesName}
                            siteid={props.site.id}
                            seriesimageurl={imageUrl}
                            seriesidonsite={props.series.seriesIdOnSite}
                            seriesid={props.series.id}> 
                            {props.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SeriesCard;