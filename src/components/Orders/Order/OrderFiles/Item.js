import React from 'react';
import {Card, CardDescription, CardMeta, Form, Grid, GridColumn, GridRow, Input} from "semantic-ui-react";
import {getSmallestValue} from '../../../../_helpers/size-converter'
import folderImage from '../../../../assets/images/Folder@1x.png';
import './Item.scss';

export default class Item extends React.Component {

    state = {
        newFolderName: this.props.value.itemName
    };

    render() {
        let {value, onFolderCreate, onItemSelected, selected} = this.props;

        if (value.contentType && value.contentType.match('(image/.*|folder)')) {
            let newFolder = value.new;

            let items = value.contentType.split('/');
            const contentType = items[items.length - 1];

            let itemName = value.itemName;

            if (value.contentType.match('image/.*')) {
                let itemNameParts = itemName.split('.');

                itemNameParts.splice(-1, 1);

                itemName = itemNameParts.join('.');
            }

            const size = getSmallestValue(value.size);

            return (
                <Card className={`photo-container${selected ? ' selected' : ''}`}
                      image={contentType === 'folder'
                          ? folderImage
                          : value.thumbnailUrl}
                      header={newFolder
                          ? <Form onSubmit={onFolderCreate}>
                              <Input className={'new-folder-input'}
                                     fluid
                                     autoFocus
                                     type={'input'}
                                     name={'newFolderName'}
                                     value={this.state.newFolderName}
                                     onChange={(event, data) => {
                                         this.setState({
                                             newFolderName: data.value
                                         });
                                     }}/>
                          </Form>
                          : <CardDescription textAlign={"center"} content={itemName}/>
                      }
                      meta={
                          value.contentType.match('image/.*')
                              ? <Grid columns={2}>
                                  <GridRow>
                                      <GridColumn>
                                          <CardMeta textAlign={'left'} content={size}/>
                                      </GridColumn>
                                      <GridColumn>
                                          <CardMeta textAlign={'right'} content={contentType}/>
                                      </GridColumn>
                                  </GridRow>
                              </Grid>
                              : null
                      }
                      onClick={onItemSelected}
                      value={value}
                />
            );
        } else {
            return null;
        }
    }

}