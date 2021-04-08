import React from 'react';
import './OrderFiles.scss'
import {handleResponse} from "../../../../_helpers/handle-response";
import Path from "./Path";
import {Button, Image, Modal, ModalContent, ModalHeader, Segment, SegmentGroup} from "semantic-ui-react";
import ContentsContainer from "./ContentsContainer";
import {authenticationService} from "../../../../_services/authentication.service";

export class OrderFiles extends React.Component {

    fileInputRef = React.createRef();
    imgRef = React.createRef();

    state = {
        items: [],
        selectedItems: [],
        isDataLoading: true,
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

    createFolder = (event, data, form) => {
        let folderName = data.children.props.value;

        let sameCount = this.state.items.filter(item => item.itemName === folderName).length;

        if (sameCount > 1) {
            return;
        }

        let currentFolderPath = localStorage.getItem('additionalPath')
            ? (localStorage.getItem('additionalPath') + '/')
            : '';
        let fullPath = currentFolderPath + folderName;
        this.setState({isDataLoading: true});
        fetch(`/api/orders/order/${this.state.orderId}/createFolder?path=${fullPath}`, {method: 'POST'})
            .then(response => handleResponse(response))
            .then(result => {
                let {items} = this.state;
                items.filter(item => item.itemName === folderName)[0].new = null;
                this.setState({items: items});
            })
            .catch(error => console.error(error.message))
            .finally(() => this.setState({isDataLoading: false}));
    };

    uploadFiles = (e) => {
        if (e.target.files.length === 0)
            return;

        let additionalPath = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath')
            : '';

        this.setState({isDataLoading: true});

        const formData = new FormData();

        for (const file of e.target.files) {
            formData.append('files', file, file.name);
        }

        let url = `/api/orders/order/${this.state.orderId}/uploadPhoto`;
        if (additionalPath.length > 0) {
            url += `?path=${additionalPath.slice(0, -1)}`;
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

    newFolder = () => {
        let newFolder = {
            contentType: 'folder',
            itemName: 'New folder',
            new: true
        };
        let {items} = this.state;

        let newFolders = items.filter(item => item.itemName.match('New folder.*'));
        newFolders.sort();

        let maxFolderNumber = 0;
        for (let i = 0; i < newFolders.length; i++) {
            let folder = newFolders[i];

            if (folder.itemName.match('.*\\(.*\\).*')) {
                let number = folder.itemName.match(/\((\d)\)/)[1];
                if (number && number > maxFolderNumber) {
                    maxFolderNumber = number;
                }
            }
        }
        if (maxFolderNumber > 0) {
            newFolder.itemName += ` (${++maxFolderNumber})`;
        }

        items.push(newFolder);
        this.setState({items: items});
    };

    editFiles = (e) => {
    };

    deleteFiles = () => {
        const filesToDelete = this.state.selectedItems;
        let additionalPath = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath')
            : '';

        let filesUris = filesToDelete.map(file => {
            return additionalPath + file.itemName;
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

        if (realValue.new) {
            return;
        }

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
        let currentAdditionalPath = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath')
            : '';

        let paths = currentAdditionalPath.split('/').filter(e => e !== '');
        paths.push(folderName);

        currentAdditionalPath = paths.join('/');
        this.setState({isDataLoading: true});
        localStorage.setItem('additionalPath', currentAdditionalPath);

        this.fetchOrderFile(this.state.orderId);
    }

    openImage(image) {
        this.setState({
            fullSizedImage: image,
            showFullSizeImage: true
        });
    }

    goBack() {
        let currentAdditionalPath = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath')
            : '';

        let curPathParts = currentAdditionalPath
            .split('/')
            .filter(path => path !== '');
        console.log(curPathParts);
        curPathParts.pop();

        currentAdditionalPath = curPathParts.length !== 0 && curPathParts[0] === ''
            ? ''
            : curPathParts.join('/');

        this.setState({isDataLoading: true});
        localStorage.setItem("additionalPath", currentAdditionalPath);

        this.fetchOrderFile(this.state.orderId);
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
        let path = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath')
            : '';

        path = path.slice(0, -1);
        this.setState({isDataLoading: true});

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
            this.setState({isDataLoading: false});
        });
    }

    fetchOrderFile(orderId) {
        let additionalPath = localStorage.getItem('additionalPath')
            ? localStorage.getItem('additionalPath')
            : '';

        let url = `/api/orders/order/${orderId}/getPhotos` +
            (
                additionalPath && additionalPath.length > 0
                    ? `?additionalPath=${additionalPath}/`
                    : ''
            );

        fetch(url)
            .then(response => {
                return handleResponse(response);
            })
            .then(data => {
                this.setState({items: data.sort(this.compare).filter((item) => {
                    return item.itemName !== 'thumbnails';
                })});
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to fetch photos. " + error)
            })
            .finally(() => this.setState({isDataLoading: false}));
    }

    render() {
        let additionalPath = localStorage.getItem('additionalPath', '')
            ? localStorage.getItem('additionalPath')
            : '';

        let countOfImages = this.state.items.filter(item => item.contentType.match('image/.*')).length;

        return (
            <>
                <SegmentGroup className={'order-files-segment-group'}>
                    <SegmentGroup horizontal className={'filemanager-header'}>
                        <div className={'path'}>
                            <Path/>
                        </div>
                        <Segment textAlign={"right"} className={'files-count'}>
                            <span>Files count: {countOfImages}</span>
                        </Segment>
                    </SegmentGroup>
                    <Segment className={'buttons-group'}>
                        <Button className={'button'} size={'medium'} icon={'arrow left'} content={'Back'}
                                disabled={this.state.isDataLoading || additionalPath.length === 0}
                                onClick={this.goBack}/>
                        {authenticationService.isAdmin &&
                        <>
                            <Button className={'button'} size={'medium'} icon={'add'} content={'New folder'}
                                    disabled={this.state.isDataLoading} onClick={this.newFolder}/>
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
                                disabled={this.state.isDataLoading || this.state.items.length === 0}
                                onClick={this.archiveAndDownload}/>

                        {/*<Button className={'button'} size={'medium'} icon={'refresh'}*/}
                        {/*        floated={'right'} disabled={this.state.isDataLoading}*/}
                        {/*        onClick={() => {this.setState({key: Math.random()})}}/>*/}
                    </Segment>
                    <ContentsContainer key={Math.random()}
                                       items={this.state.items}
                                       isDataLoading={this.state.isDataLoading}
                                       onFolderCreate={this.createFolder}
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