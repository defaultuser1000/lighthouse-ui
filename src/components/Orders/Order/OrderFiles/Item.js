import React from 'react';
import {Card, CardDescription, CardMeta, Grid, GridColumn, GridRow} from "semantic-ui-react";
import {getSmallestValue} from '../../../../_helpers/size-converter'
import folderImage from '../../../../assets/images/Folder@1x.png';
import './Item.scss';

export default class Item extends React.Component {

    render() {
        let {value, onItemSelected, selected} = this.props;

        if (value.contentType && value.contentType.match('(image/.*|folder)')) {
            let items = value.contentType.split('/');
            const contentType = items[items.length - 1];

            let itemName = value.itemName;

            if (value.contentType.match('image/.*')) {
                let itemNameParts = itemName.split('.');

                itemNameParts = itemNameParts.length === 2
                    ? [itemNameParts[0]]
                    : itemNameParts.splice(itemNameParts.length - 1, 1);

                itemName = itemNameParts.join('.');
            } else {
                itemName = value.itemName;
            }

            const size = getSmallestValue(value.size);

            return (
                <Card className={`photo-container ${selected ? 'selected' : ''}`}
                      image={contentType === 'folder'
                          ? folderImage
                          : value.thumbnailUrl}
                      header={
                          <CardDescription textAlign={"center"} content={itemName}/>
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
                      onDoubleClick={() => {
                          window.alert('Double clicked')
                      }}
                      value={value}
                />
            );
        } else {
            return null;
        }
    }

}