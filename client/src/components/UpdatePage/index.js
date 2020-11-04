import React, {useState, useEffect} from 'react';
import axios from "axios";
import SiteCard from "../SiteCard";

function UpdatePage() {
    const [siteList, setSiteList] = useState([]);

    useEffect(() => {
        axios.get('/api/site')
            .then((resp) => {
                setSiteList(resp.data);
            })
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1 text-center">Media Updates</h1>
                    {siteList.map((site) => <SiteCard key={site.id} site={site}/>)}
                </div>
            </div>
        </div>
    );
}

export default UpdatePage;
