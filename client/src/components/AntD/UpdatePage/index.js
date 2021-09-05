import React, {useState, useEffect} from 'react';
import {Table, Switch, Form, Space} from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import axios from "axios";

export default function UpdatePage () {
    const [seriesListWithUpdates, setSeriesListWithUpdates] = useState([]);
    const [hideRead, setHideRead] = useState(true);

    useEffect(() => {
        axios.get('/api/series')
            .then((resp) => {                
                resp.data.forEach(series => {
                    axios.get('/api/series/'+series.id).then((updatedSeriesInfo) => {
                        setSeriesListWithUpdates(currentSeriesList => {
                            const tmp = [...currentSeriesList];
                            tmp.push(updatedSeriesInfo.data[0]);
                            console.log("currentSeries ", tmp);
                            return sortSeries(tmp);
                        });
                    })
                });
            })
    }, [])
      
    const columns = [
        {
            title: 'Series Image',
            dataIndex: 'seriesImageUrl',
            key: 'seriesImage',
            render: (theImageURL, record) => <a rel="noopener noreferrer" target="_blank" href={record['SeriesSite.seriesUrlTemplate'].replace('${seriesId}', record.seriesIdOnSite)}><img alt="Series Cover" src={theImageURL} width="50"/></a>,
        },
        {
            title: 'Series Name',
            dataIndex: 'seriesName',
            key: 'seriesName',
            render: (theSeriesName, record) => <a onClick={markSeriesViewed} data-id={record.id} rel="noopener noreferrer" target="_blank" href={record['SeriesSite.seriesUrlTemplate'].replace('${seriesId}', record.seriesIdOnSite)}><span style={record.hasUpdate ? {fontWeight: 'bold'} : {}}>{theSeriesName}</span></a>,
        },
        {
<<<<<<< Updated upstream
=======
            title: 'Chapter',
            dataIndex: 'latestChapter',
            key: 'chapterNumber',
        },
        {
>>>>>>> Stashed changes
            title: 'Site',
            dataIndex: 'SeriesSite.siteName',
            key: 'site',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                <DeleteTwoTone onClick={deleteSeries} data-id={record.id} style={{fontSize:"20px"}} twoToneColor="#eb2f96" />
                {/* <a onClick={deleteSeries} data-id={record.id} href="#">Remove</a> */}
              </Space>
            ),
        },
    ];

    const flipFlag = () => {
        setHideRead(!hideRead);
    }

    const sortSeries = (seriesList) => {
        const sorted = seriesList.sort(function(a, b) {
            var nameA = a.seriesName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.seriesName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
        });
        return sorted;
    }

    const markSeriesViewed = (e) => {
        const seriesId = e.currentTarget.dataset.id;
        const chapterNumber = e.currentTarget.dataset.chapterNumber;
        if (seriesId){
            let details  = {
                latestChapter: chapterNumber,
            }
            console.log("hello  "  + JSON.stringify(details));
            axios.put(`/api/series/${seriesId}/mark_last_checked`, details, {
                headers: {
                  'Content-Type': "application/json"
                }
              });
            const seriesIndex = seriesListWithUpdates.findIndex((series) => series.id == seriesId);
            if(seriesIndex >= 0){
                const tmp = [...seriesListWithUpdates];
                tmp[seriesIndex].hasUpdate = false;
                setSeriesListWithUpdates(tmp);
            }
        }
    }

    const deleteSeries = (e) => {
        let seriesId = e.currentTarget.dataset.id;
        if (seriesId) {
            axios.delete(`/api/series/${seriesId}`)
            .then((response) => {
                let tmp = [...seriesListWithUpdates];
                let seriesIdInt = parseInt(seriesId);
                tmp.splice(tmp.findIndex(item => item.id === seriesIdInt), 1);
                setSeriesListWithUpdates(tmp);
            });
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1 text-center">Media Updates</h1>
                    <Form layout="inline" className="components-table-demo-control-bar" style={{ marginBottom: 16 }}>
                        <Form.Item label="Hide Read">
                            <Switch checked={hideRead} onChange={flipFlag} />                        
                        </Form.Item>
                    </Form>
                    <Table 
                        columns={columns}
                        rowKey={record => record.id} 
                        loading={seriesListWithUpdates.length === 0}
                        dataSource={seriesListWithUpdates.filter((series) => series.hasUpdate === true || hideRead === false)} />
                </div>
            </div>
        </div>
    );
}