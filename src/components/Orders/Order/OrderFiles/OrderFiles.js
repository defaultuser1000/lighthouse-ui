import React from 'react';
import './OrderFiles.scss'
import {handleResponse} from "../../../../_helpers/handle-response";
import Path from "./Path";
import {Button, Image, Modal, ModalContent, ModalHeader, Segment, SegmentGroup} from "semantic-ui-react";
import ContentsContainer from "./ContentsContainer";
import {authenticationService} from "../../../../_services/authentication.service";
import NewFolder from "./NewFolder";

export class OrderFiles extends React.Component {

    fileInputRef = React.createRef();
    imgRef = React.createRef();

    state = {
        items: [],
        selectedItems: [],
        isDataLoading: true,
        additionalPath: '',
        orderId: '',
        editing: false,
        showFullSizeImage: false,
        fullSizedImage: {
            itemName: null,
            url: null,
            thumbnailUrl: null,
            contentType: null,
            size: null
        },
        fullSizedImageDimensions: {
            width: null,
            height: null
        },
        key: Math.random()
    };

    uploadFiles = (e) => {
        if (e.target.files.length === 0)
            return;

        this.setState({isDataLoading: true});

        const formData = new FormData();

        for (const file of e.target.files) {
            formData.append('files', file, file.name);
        }

        let url = `/api/orders/order/${this.state.orderId}/uploadPhoto`;
        if (this.state.additionalPath.length > 0) {
            url += `?path=${this.state.additionalPath}`;
        }

        fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => {
            return handleResponse(response);
        }).then(result => {
            let items = this.state.items;
            let finalItems = [...items, ...result];
            this.setState({items: finalItems});
        }).catch(error => {
            console.error(error.message);
            return [];
        }).finally(() => {
            this.setState({isDataLoading: false});
        });
    };

    editFiles = (e) => {};

    deleteFiles = () => {
        const filesToDelete = this.state.selectedItems;

        let filesUris = filesToDelete.map(file => {
            return this.state.additionalPath + file.itemName;
        });

        this.setState({isDataLoading: true});

        fetch(`/api/orders/order/${this.state.orderId}/deletePhotos`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filesUris)
        }).then(response => {
            return handleResponse(response);
        }).then(() => {
            let filesToDelete = this.state.selectedItems;
            let allItems = this.state.items;

            filesToDelete.forEach(item => {
                let index = allItems.indexOf(item);
                if (index > -1) {
                    allItems.splice(index, 1);
                }
            });
            this.setState({items: allItems, selectedItems: []});
        }).catch(error => {
            console.log(error.message);
        }).finally(() => {
            this.setState({isDataLoading: false});
        });
    };

    selectedItem = (e, value) => {
        const realValue = value.value;

        if (!this.state.editing) {
            if (realValue.contentType === 'folder') {
                this.openFolder(realValue.itemName);
            } else {
                this.openImage(realValue);
            }
        } else {
            let {selectedItems} = this.state;
            const itemIdx = selectedItems.indexOf(realValue);

            if (itemIdx === -1) {
                selectedItems.push(realValue);
            } else {
                selectedItems.splice(itemIdx, 1);
            }

            this.setState({selectedItems: selectedItems});
        }
    };

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.archiveAndDownload = this.archiveAndDownload.bind(this);

        if (this.props.orderId) {
            this.state.orderId = this.props.orderId;
            this.fetchOrderFile(this.props.orderId);
        }
    }

    openFolder(folderName) {
        let currentAdditionalPath = this.state.additionalPath;
        currentAdditionalPath += folderName + '/';
        this.setState({isDataLoading: true});
        this.fetchOrderFile(this.state.orderId, currentAdditionalPath);
        this.setState({additionalPath: currentAdditionalPath});
    }

    openImage(image) {
        this.setState({
            fullSizedImage: image,
            showFullSizeImage: true
        });
    }

    goBack() {
        let currentAdditionalPath = this.state.additionalPath;
        let curPathParts = currentAdditionalPath.split('/');
        curPathParts = curPathParts.splice(curPathParts.length - 1, 1);

        currentAdditionalPath = curPathParts.length !== 0 && curPathParts[0] === '' ? '' : (curPathParts.join('/') + '/');
        this.setState({isDataLoading: true});
        this.fetchOrderFile(this.state.orderId, currentAdditionalPath);
        this.setState({additionalPath: currentAdditionalPath});
    }

    compare(a, b) {
        if (a.contentType === 'folder' && b.contentType === 'folder') {
            return 1;
        }
        if (a.contentType === 'folder' && b.contentType !== 'folder') {
            return -1;
        }
        return 0;
    }

    archiveAndDownload() {
        let path = this.state.additionalPath;
        path = path.slice(0, -1);
        this.setState({ isDataLoading: true });

        fetch(`/api/orders/order/${this.state.orderId}/downloadPhotos${path.length > 0 ? `?path=${path}` : ''}`, {
            method: 'GET',
            responseType: 'blob'
        }).then(response => {
            if (response.ok) {
                const filename = response.headers.get('Content-Disposition').split('filename=')[1]
                    .replace("\"", "").replace("\"", "");

                return response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                });
            }
        }).catch(error => {
            console.error(error.message);
        }).finally(() => {
            this.setState({ isDataLoading: false });
        });
    }

    fetchOrderFile(orderId, additionalPath) {
        let url = `/api/orders/order/${orderId}/getPhotos` +
            (
                additionalPath && additionalPath.length > 0
                    ? `?additionalPath=${additionalPath}`
                    : ''
            );

        fetch(url)
            .then(response => {
                return handleResponse(response);
            })
            .then(data => {
                this.state.items = data.sort(this.compare).filter((item) => {
                    return item.itemName !== 'thumbnails';
                });
                this.state.isDataLoading = false;
                this.forceUpdate();
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    render() {

        return (
            <>
                <SegmentGroup>
                    <SegmentGroup horizontal className={'filemanager-header'}>
                        <div className={'path'}>
                            <Path additionalPath={this.state.additionalPath}/>
                        </div>
                        <Segment textAlign={"right"} className={'files-count'}>
                            <span>Files count: {10}</span>
                        </Segment>
                    </SegmentGroup>
                    <Segment className={'buttons-group'}>
                        <Button className={'button'} size={'medium'} icon={'arrow left'} content={'Back'}
                                disabled={this.state.isDataLoading || this.state.additionalPath.length === 0}
                                onClick={this.goBack}/>
                        {authenticationService.isAdmin &&
                        <>
                            <Button className={'button'} size={'medium'} icon={'add'} content={'New folder'}
                                    disabled={this.state.isDataLoading} onClick={() => {
                                        // let items = this.state.items;
                                        // items.push(<NewFolder/>);
                                        // this.setState({items: items});
                            }}/>
                            {this.state.editing
                                ? <Button className={'button'} size={'medium'} icon={'cancel'}
                                          content={'Cancel'}
                                          disabled={this.state.isDataLoading} onClick={() => {
                                    this.setState({editing: false, selectedItems: []})
                                }}/>
                                : <Button className={'button'} size={'medium'} icon={'pencil'} content={'Edit'}
                                          disabled={this.state.isDataLoading} onClick={() => {
                                    this.setState({editing: true})
                                }}/>
                            }
                            {(this.state.editing && this.state.selectedItems.length === 1) &&
                            <Button className={'button'} size={'medium'} icon={'pencil'} content={'Rename'}
                                    disabled={this.state.isDataLoading}/>
                            }
                            {(this.state.editing
                                && this.state.selectedItems.length > 0
                                && this.state.selectedItems.filter(item => item.contentType === 'folder').length === 0) &&
                            <Button className={'button'} size={'medium'} icon={'trash'} content={'Delete'}
                                    disabled={this.state.isDataLoading} onClick={this.deleteFiles}/>
                            }
                            {!this.state.editing &&
                            <>
                                <Button className={'button'} size={'medium'} icon={'upload'} content={'Upload file'}
                                        disabled={this.state.isDataLoading}
                                        onClick={() => this.fileInputRef.current.click()}/>
                                <input ref={this.fileInputRef}
                                       type="file"
                                       hidden
                                       onChange={this.uploadFiles}
                                       multiple
                                       accept='image/*'
                                />
                            </>
                            }
                        </>
                        }
                        <Button className={'button'} size={'medium'} icon={'download'} content={'Archive'}
                                disabled={this.state.isDataLoading || this.state.items.length === 0} onClick={this.archiveAndDownload}/>

                        {/*<Button className={'button'} size={'medium'} icon={'refresh'}*/}
                        {/*        floated={'right'} disabled={this.state.isDataLoading}*/}
                        {/*        onClick={() => {this.setState({key: Math.random()})}}/>*/}
                    </Segment>
                    <ContentsContainer key={Math.random()}
                                       items={this.state.items}
                                       isDataLoading={this.state.isDataLoading}
                                       onItemSelect={this.selectedItem}
                                       selectedItems={this.state.selectedItems}/>
                </SegmentGroup>
                <Modal open={this.state.showFullSizeImage}
                       onClose={() => {
                           this.setState({
                               fullSizedImage: {
                                   itemName: null,
                                   url: null,
                                   thumbnailUrl: null,
                                   contentType: null,
                                   size: null
                               }, showFullSizeImage: false
                           })
                       }}>
                    <ModalHeader>{this.state.fullSizedImage.itemName}</ModalHeader>
                    <ModalContent>
                        <Image ref={this.imgRef} src={this.state.fullSizedImage.url}/>
                    </ModalContent>
                </Modal>
            </>
        );
    }
}

export default OrderFiles;