import React, {useState, useEffect} from 'react';
import {Table, Switch, Form, Space} from 'antd';
import { DeleteTwoTone, SyncOutlined } from '@ant-design/icons';
import axios from "axios";

export default function UpdatePage () {
    const [seriesListWithUpdates, setSeriesListWithUpdates] = useState([]);
    const [hideRead, setHideRead] = useState(false);

    useEffect(() => {
        axios.get('/api/series')
            .then((resp) => {                
                resp.data.forEach(series => {
                    axios.get('/api/series/'+series.id).then((updatedSeriesInfo) => {
                        setSeriesListWithUpdates(currentSeriesList => {
                            const tmp = [...currentSeriesList];
                            tmp.push(updatedSeriesInfo.data[0]);
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
            render: (theSeriesName, record) => (
                <Space size="middle">
                    <img className="fit-picture" src={"https://manganato.com/favicon.png"} alt="Series site URL"/>
                    <a onClick={markSeriesViewed} data-id={record.id} data-chapternumber={record.latestChapter} rel="noopener noreferrer" target="_blank" href={record['SeriesSite.seriesUrlTemplate'].replace('${seriesId}', record.seriesIdOnSite)}><span style={record.hasUpdate ? {fontWeight: 'bold'} : {}}>{theSeriesName}</span></a>
                </Space>
            ),
        },
        {
            title: 'Chapter',
            dataIndex: 'latestChapter',
            key: 'chapterNumber',
            render: (theLatestChapter, record) => (
                <Space size="middle">
                    <p>{record.lastChapterViewed+"/"+theLatestChapter}</p>
                </Space>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                <SyncOutlined onClick={refreshSeries} data-id={record.id} spin={!('hasUpdate' in record)} twoToneColor="#eb2f96" />
                <DeleteTwoTone onClick={deleteSeries} data-id={record.id} style={{fontSize:"20px"}} twoToneColor="#eb2f96" />
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
        const chapterNumber = e.currentTarget.dataset.chapternumber;
        const body = { lastChapter: chapterNumber };
        if (seriesId){
            axios.put(`/api/series/${seriesId}/mark_last_checked`, body);
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

    const refreshSeries = (e) => {
        let seriesId = e.currentTarget.dataset.id;
        const seriesIndex = seriesListWithUpdates.findIndex((entry) => {return entry.id == seriesId})
        setSeriesListWithUpdates(currentSeriesList => {
            let tmp = [...currentSeriesList];
            delete tmp[seriesIndex].hasUpdate;
            return tmp;
        });
        axios.get('/api/series/'+seriesId).then((updatedSeriesInfo) => {
            setSeriesListWithUpdates(currentSeriesList => {
                const tmp = [...currentSeriesList];
                tmp[seriesIndex] = updatedSeriesInfo.data[0];
                return tmp;
            });
        })
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