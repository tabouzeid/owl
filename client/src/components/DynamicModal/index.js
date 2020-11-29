import React, { useEffect, useState } from 'react';

export default function DynamicModal(props) {
    const modalName = props.modalName;
    const onSave = props.submitFunc;
    const [site, setSite] = useState(
        {
            siteName: "", 
            dateClassSelectionQuery: "", 
            siteUrl: "", 
            searchUrlTemplate: "", 
            seriesUrlTemplate: ""
        }
    );
    
    const onSubmit = (event) => {
        onSave(site);
    }

    useEffect(()=>{
        if(props.site) {
            setSite(
                {
                    id: props.site.id,
                    siteName: props.site.siteName, 
                    dateClassSelectionQuery: props.site.dateClassSelectionQuery, 
                    siteUrl: props.site.siteUrl, 
                    searchUrlTemplate: props.site.searchUrlTemplate, 
                    seriesUrlTemplate: props.site.seriesUrlTemplate
                }
            );
        } else {
            setSite(
                {
                    id: -1,
                    siteName: "", 
                    dateClassSelectionQuery: "", 
                    siteUrl: "", 
                    searchUrlTemplate: "", 
                    seriesUrlTemplate: ""
                }
            );
        }
    }, [props])

    const handleChange = (event) => {
        site[event.target.name] = event.target.value;
        setSite({...site});
    }

    return (
            <div className="modal fade" id={modalName} tabIndex="-1" aria-labelledby={modalName+"Label"} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={modalName+"Label"}>Site Information</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className="form-group">
                                    <label>Site Name:</label>
                                    <input type="text" 
                                           className="form-control" 
                                           id="siteName" 
                                           name="siteName" 
                                           onChange={handleChange}
                                           placeholder="Name of the site" 
                                           value={site.siteName} 
                                           aria-describedby="SiteName" />
                                </div>
                                <div className="form-group">
                                    <label>Date Selection Query:</label>
                                    <input type="text" 
                                           className="form-control" 
                                           id="dateClassSelectionQuery" 
                                           name="dateClassSelectionQuery" 
                                           onChange={handleChange}
                                           placeholder="Date Selection Query" 
                                           value={site.dateClassSelectionQuery} 
                                           aria-describedby="DateSelectionQuery" />
                                </div>
                                <div className="form-group">
                                    <label>Site URL:</label>
                                    <input type="text" 
                                           className="form-control" 
                                           name="siteUrl" 
                                           onChange={handleChange}
                                           placeholder="Url of the site" 
                                           value={site.siteUrl} 
                                           aria-describedby="SiteUrl" />
                                </div>
                                <div className="form-group">
                                    <label>Search URL Template:</label>
                                    <input type="text" 
                                           className="form-control" 
                                           name="searchUrlTemplate" 
                                           onChange={handleChange}
                                           placeholder="Url Template for Searching the series" 
                                           value={site.searchUrlTemplate} 
                                           aria-describedby="SearchUrlTemplate"/>
                                </div>
                                <div className="form-group">
                                    <label>Series URL Template:</label>
                                    <input type="text" 
                                           className="form-control" 
                                           name="seriesUrlTemplate" 
                                           onChange={handleChange}
                                           placeholder="Url Template for navingating to the series" 
                                           value={site.seriesUrlTemplate} 
                                           aria-describedby="SeriesUrlTemplate" /> 
                                </div>
                                <button type="submit" className="btn btn-primary">{props.buttonText}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}