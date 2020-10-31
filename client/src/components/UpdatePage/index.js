import React, {useContext} from 'react';
import SiteCard from "../SiteCard";
import UserSeriesContext from "../../util/UserSeriesContext";

function UpdatePage() {
    const {userData} = useContext(UserSeriesContext);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1 text-center">Media Updates</h1>
                    {userData.siteList.map((site) => <SiteCard key={site.id} site={site}/>)}
                </div>
            </div>
        </div>
    );
}

export default UpdatePage;
