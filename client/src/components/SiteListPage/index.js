import React, { useEffect, useState } from "react";
import DynamicModal from "../DynamicModal";
import axios from 'axios';

export default function SiteListPage() {
    const defaultLogo = "https://i.fbcd.co/products/original/88494717b822939c8d3ac91eae0719212b91ef98e625e46e2713a6dbd7625184.jpg";
    const [sites, setSites] = useState([]);
    const [index, setIndex] = useState(-1);
    const modalName = "siteModal";

    useEffect(() => {
        axios.get('/api/site')
            .then((response) => {
                setSites(response.data);
            })
            .catch((error) => {
                alert("an error occurred while retrieving the list of sites");
            })
    }, []);

    const updateSiteDetails = (siteData) => {
        axios.put('/api/site/', siteData)
        .then((response) => {
            setSites(response.data);
        })
        .catch((error) => {
            alert("An error occurred while updating a site.");
        });
    }

    const deleteSite = (event) => {
        const siteIndex = parseInt(event.target.getAttribute('index'));
        axios.delete('/api/site/'+sites[siteIndex].id)
        .then((response) => {
            setSites(response.data);
        })
        .catch((error) => {
            alert("An error occurred while deleting a site.");
        });
    }

    const addSite = (siteData) => {
        siteData.id = '';
        axios.post('/api/site', siteData)
        .then((response) => {
            setSites(response.data);
        })
        .catch((error) => {
            alert("An error occurred while adding a site.");
        });
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-4" />
                    <div className="col-4">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Actions</th>
                                    <th scope="col">
                                        <svg onClick={(event) => {setIndex(-1)}} data-toggle="modal"  data-target={"#"+modalName} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                            <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sites.map((site, index) =>
                                    (
                                        <tr key={index}>
                                            <td><img src={defaultLogo} alt="sitelogo" style={{ width: "50px" }} /></td>
                                            <td>{site.siteName}</td>
                                            <td>
                                                <button type="button" onClick={(event) => {setIndex(index)}} className="btn btn-success mr-1" data-toggle="modal"  data-target={"#"+modalName}>
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pen" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                                    </svg>
                                                </button>
                                                <button type="button" className="btn btn-danger" index={index} onClick={deleteSite}>
                                                    <svg index={index} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path index={index} d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path index={index} fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-4" />
                </div>
            </div>
            <DynamicModal site={sites[index]} 
                          modalName={modalName} 
                          buttonText={index >= 0 ? 'Update' : 'Add'} 
                          submitFunc={index >= 0 ? updateSiteDetails : addSite} /> 
        </div>
    );
}