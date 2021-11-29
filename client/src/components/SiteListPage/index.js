import React, { useEffect, useState } from "react";
import DynamicModal from "../DynamicModal";
import axios from 'axios';
import { Form, Table, Space, Button, Modal, Input } from "antd";

export default function SiteListPage() {
    const [sites, setSites] = useState([]);
    const [index, setIndex] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modalName = "siteModal";

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

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

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };

    const columns = [
        {
            title: 'Logo',
            dataIndex: 'siteFaviconUrl',
            key: 'logo',
            render: logoPicUrl => <img src={logoPicUrl} alt="sitelogo" style={{ width: "30px" }} />
        },
        {
            title: 'Name',
            dataIndex: 'siteName',
            key: 'name',
            render: (text,record) => <a href={record['siteUrl']} target={'_blank'}>{text}</a>
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="small">
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
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-4"/>
                    <div className="col-4">
                        <Button type="primary" onClick={showModal}>
                            Add Site
                        </Button>
                        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText={"Submit"}>
                            <Form {...layout} name="siteForm" autoComplete="off">
                                <Form.Item label="Site Name">
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Site Logo">
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Series URL Template">
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Site URL">
                                    <Input/>
                                </Form.Item>
                            </Form>
                        </Modal>
                        <Table columns={columns} dataSource={sites} />
                    </div>
                    <div className="col-4"/>
                </div>
            </div>
            {/* <DynamicModal site={sites[index]} 
                          modalName={modalName} 
                          buttonText={index >= 0 ? 'Update' : 'Add'} 
                          submitFunc={index >= 0 ? updateSiteDetails : addSite} />  */}
        </div>
    );
}