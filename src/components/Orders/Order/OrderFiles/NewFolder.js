import React from 'react';
import folderImage from '../../../../assets/images/Folder@1x.png';
import {Card, CardDescription, Input} from "semantic-ui-react";

export default class NewFolder extends React.Component {

    render() {
        return (
            <Card image={folderImage}
                  header={
                      <CardDescription textAlign={"center"} content={<Input/>}/>
                  }
                  // onClick={onItemSelected}
                  // value={value}
            />
        );
    }
}