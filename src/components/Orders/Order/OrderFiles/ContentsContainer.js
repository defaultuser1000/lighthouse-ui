import React from 'react';
import Item from "./Item";
import {Segment} from "semantic-ui-react";

export default class ContentsContainer extends React.Component {

    state = {
        data: this.props.items,
        selectedItems: this.props.selectedItems,
        isDataLoading: true
    };

    render() {
        return (
            <Segment className={'gallery with-overflow vertical'} loading={this.props.isDataLoading}>
                {this.state.data.map((item) =>
                    <Item value={item} key={this.state.data.indexOf(item)}
                          onItemSelected={this.props.onItemSelect}
                          selected={this.state.selectedItems.indexOf(item) !== -1}/>
                )}
            </Segment>
        );
    }

}